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
const fetch = require('node-fetch');
const ora = require('ora');

// Utils
const {marketplace: host} = require('../lib/utils');

/**
 * `$ strapi login`
 *
 * Connect your account to Strapi solutions.
 */

/* eslint-disable prefer-template */
/* eslint-disable no-console */
module.exports = function () {
  let loader = ora('Test internet connection').start();
  // First, check the internet connectivity.
  dns.lookup('strapi.io', async (err) => {
    if (err) {
      loader.fail('No internet access...');
      process.exit(1);
    }

    loader.stop();

    await new Promise((resolve) => {
      const HOME = process.env[process.platform === 'win32' ? 'USERPROFILE' : 'HOME'];

      fs.access(path.resolve(HOME, '.strapirc'), fs.F_OK | fs.R_OK | fs.W_OK, async (err) => {
        if (err) {
          console.log('⛔️ You have to be logged.');
          process.exit();
        } else {
          const config = JSON.parse(fs.readFileSync(path.resolve(HOME, '.strapirc'), 'utf8'));

          if (!config.jwt) {
            console.log('⛔️ You have to be logged.');
            process.exit();
          }

          let loader = ora('Fetch Strapi profile').start();

          const user = await fetch(`${host}/user/me`, {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${config.jwt}`
            }
          })
            .then(res => res.json());

          loader.stop();

          console.log(user);
        }

        resolve();
      });
    });
  });
};
