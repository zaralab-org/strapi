#!/usr/bin/env node

'use strict';

/**
 * Module dependencies
 */

// Utils
const {writeConfig} = require('../lib/utils');

/**
 * `$ strapi logout`
 *
 * Logout your account to Strapi solutions.
 */

/* eslint-disable prefer-template */
/* eslint-disable no-console */
module.exports = async () => {
  await writeConfig({}, {force: true});
  console.log('You are logout. See you soon 👋 ');
};
