#!/usr/bin/env node

'use strict';

/**
 * Module dependencies
 */

// Public node modules.
const {cyan, gray} = require('chalk');
const fetch = require('node-fetch');
const ora = require('ora');

// Utils
const {marketplace: host, internet, getConfig} = require('../lib/utils');

/**
 * `$ strapi login`
 *
 * Connect your account to Strapi solutions.
 */

/* eslint-disable prefer-template */
/* eslint-disable no-console */
module.exports = async () => {
  await internet();

  const config = await getConfig();

  if (!config.jwt) {
    console.log('⛔️ You have to be loggin.');
    process.exit();
  }

  let loader = ora('Fetch Strapi profile').start();

  const user = await fetch(`${host}/user/me`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${config.jwt}`
    }
  })
    .then(res => res.json())
    .catch(() => {
      loader.fail('Server error, please contact support@strapi.io');
      process.exit(1);
    });

  loader.stop();

  console.log(`You are login as ${cyan(user.username)} ${gray(`(${user.email})`)}`);
};
