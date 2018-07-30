#!/usr/bin/env node

'use strict';

/**
 * Module dependencies
 */

// Node.js core.
const fs = require('fs');
const path = require('path');

/**
 * `$ strapi logout`
 *
 * Logout your account to Strapi solutions.
 */

/* eslint-disable prefer-template */
/* eslint-disable no-console */
module.exports = function () {
  const HOME = process.env[process.platform === 'win32' ? 'USERPROFILE' : 'HOME'];

  // Try to access the `.strapirc` at $HOME.
  fs.access(path.resolve(HOME, '.strapirc'), fs.F_OK | fs.R_OK | fs.W_OK, (err) => {
    if (err) {
      console.log('You are not logged in.');
    } else {
      const config = JSON.parse(fs.readFileSync(path.resolve(HOME, '.strapirc'), 'utf8'));

      delete config.email;
      delete config.jwt;

      fs.writeFileSync(path.resolve(HOME, '.strapirc'), JSON.stringify(config), 'utf8');
      console.log('You are logout.');
      process.exit(0);
    }
  });
};
