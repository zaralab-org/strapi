#!/usr/bin/env node

'use strict';

/**
 * Module dependencies
 */

// Node.js core.
const fs = require('fs');
const path = require('path');
const dns = require('dns');

// Public node modules.
const {green, cyan} = require('chalk');
const inquirer = require('inquirer');
const _ = require('lodash');
const fetch = require('node-fetch');
const ora = require('ora');

/* eslint-disable no-useless-escape */
const emailRegExp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

/**
 * `$ strapi login`
 *
 * Connect your account to Strapi solutions.
 */

/* eslint-disable prefer-template */
/* eslint-disable no-console */
module.exports = function () {
  const host = 'http://localhost:1337';

  let loader = ora('Test internet connection').start();
  // First, check the internet connectivity.
  dns.lookup('strapi.io', async (err) => {
    if (err) {
      loader.fail('No internet access...');
      process.exit(1);
    }

    loader.stop();

    const {identifier, password} = await inquirer.prompt([{
      type: 'string',
      name: 'identifier',
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

    loader = ora('Strapi connection').start();

    const res = await fetch(`${host}/auth/local`, {
      method: 'POST',
      body: JSON.stringify({
        identifier,
        password
      }),
      headers: { 'Content-Type': 'application/json' }
    }).then(res => res.json());

    if (!res.jwt) {
      loader.fail(res.message);
      process.exit(1);
    }

    loader.stop();

    const HOME = process.env[process.platform === 'win32' ? 'USERPROFILE' : 'HOME'];

    // Try to access the `.strapirc` at $HOME.
    fs.access(path.resolve(HOME, '.strapirc'), fs.F_OK | fs.R_OK | fs.W_OK, (err) => {
      if (err && err.code === 'ENOENT') {
        fs.writeFileSync(path.resolve(HOME, '.strapirc'), JSON.stringify({
          email: identifier,
          jwt: res.jwt
        }), 'utf8');
        console.log(`You are ${green('successfully')} logged in as ${cyan(res.user.username)}.`);
        process.exit(1);
      } else {
        const currentJSON = fs.readFileSync(path.resolve(HOME, '.strapirc'), 'utf8');
        const newJSON = _.merge(JSON.parse(currentJSON), {
          email: identifier,
          jwt: res.jwt
        });

        fs.writeFileSync(path.resolve(HOME, '.strapirc'), JSON.stringify(newJSON), 'utf8');
        console.log(`You are ${green('successfully')} logged in as ${cyan(res.user.username)}.`);
        process.exit(0);
      }
    });
  });
};
