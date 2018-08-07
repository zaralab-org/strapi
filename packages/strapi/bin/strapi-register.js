#!/usr/bin/env node

'use strict';

/**
 * Module dependencies
 */

// Public node modules.
const {green, cyan} = require('chalk');
const inquirer = require('inquirer');
const fetch = require('node-fetch');
const ora = require('ora');

// Utils
const {marketplace: host, internet, writeConfig} = require('../lib/utils');

/* eslint-disable no-useless-escape */
const emailRegExp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

/**
 * `$ strapi login`
 *
 * Connect your account to Strapi solutions.
 */

/* eslint-disable prefer-template */
/* eslint-disable no-console */
module.exports = async () => {
  await internet();

  const auth = await inquirer.prompt([{
    type: 'string',
    name: 'username',
    message: 'Username:',
    required: true,
  }, {
    type: 'string',
    name: 'email',
    message: 'Email:',
    required: true,
    validate: (value) => {
      return emailRegExp.test(value) ? true : 'This is not a valid email address';
    }
  }, {
    type: 'password',
    name: 'password',
    message: 'Password:',
    required: true,
    mask: '*'
  }]);

  let loader = ora('Register to Strapi').start();

  const res = await fetch(`${host}/auth/local/register`, {
    method: 'POST',
    body: JSON.stringify(auth),
    headers: { 'Content-Type': 'application/json' }
  })
    .then(res => res.json())
    .catch(() => {
      loader.fail('Server error, please contact support@strapi.io');
      process.exit(1);
    });

  if (!res.jwt) {
    loader.fail(res.message);
    process.exit(1);
  }

  loader.stop();

  await writeConfig({
    email: res.user.email,
    jwt: res.jwt
  });

  console.log('📨 You receive an email to validate your account.');

  loader = ora('Waiting for email account validation').start();

  await new Promise((resolve) => {
    const interval = setInterval(async () => {
      const user = await fetch(`${host}/user/me`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${res.jwt}`
        }
      })
        .then(res => res.json())
        .catch(() => {
          loader.fail('Server error, please contact support@strapi.io');
          process.exit(1);
        });

      if (user.verified === true) {
        clearInterval(interval);
        resolve();
      }
    }, 5000);
  });

  loader.succeed(`You are ${green('successfully')} registered and logged in as ${cyan(res.user.username)}.`);
};
