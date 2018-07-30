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
const {cyan, gray} = require('chalk');
const fetch = require('node-fetch');
const ora = require('ora');

// Utils
const { cli } = require('strapi-utils');
const {marketplace: host} = require('../lib/utils');

/**
 * `$ strapi login`
 *
 * Connect your account to Strapi solutions.
 */

/* eslint-disable prefer-template */
/* eslint-disable no-console */
module.exports = function () {
  const action = process.argv[2].split(':')[1];

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

          if (action === 'list') {
            let loader = ora('Fetch your apps').start();

            const apps = await fetch(`${host}/application/list`, {
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${config.jwt}`
              }
            })
              .then(res => res.json());

            loader.stop();

            let uuid;
            try {
              const pkg = require(path.join(process.cwd(), 'package'));
              uuid = pkg.strapi.uuid;
            } catch (error) {
              // silent
            }

            if (apps.length === 0) {
              console.log('No applications is linked to your account.');
            } else {
              apps.forEach((app) => {
                console.log(`${app.name} ${gray(`(${app.uuid})`)}${app.uuid === uuid ? ` ${cyan('current')}` : ''}`);
              });
            }
          } else if (action === 'link') {
            // Check that we're in a valid Strapi project.
            if (!cli.isStrapiApp()) {
              return console.log(`⛔️ Can only be used inside a Strapi project.`);
            }

            let pkg;
            try {
              pkg = require(path.join(process.cwd(), 'package'));
            } catch (error) {
              console.log(`⛔️ Can't find package.json file.`);
              process.exit(1);
            }

            let loader = ora('Link your app').start();

            const res = await fetch(`${host}/application/link`, {
              method: 'POST',
              body: JSON.stringify({
                name: pkg.name,
                uuid: pkg.strapi.uuid
              }),
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${config.jwt}`
              }
            })
              .then(res => res.json());

            loader.stop();

            console.log(res.message);
          }
        }

        resolve();
      });
    });
  });
};
