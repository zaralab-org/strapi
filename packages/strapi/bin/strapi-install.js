#!/usr/bin/env node

'use strict';

/**
 * Module dependencies
 */

// Node.js core.
const { exec } = require('child_process');
const path = require('path');
const fs = require('fs-extra');
const shell = require('shelljs');

// Public node modules.
const fetch = require('node-fetch');

// Logger.
const { cli, logger, packageManager } = require('strapi-utils');

// Utils
const {marketplace: host, getConfig, npmAuth} = require('../lib/utils');

/**
 * `$ strapi install`
 *
 * Install a Strapi plugin.
 */

module.exports = async (plugin, cliArguments) => {
  // Define variables.
  const pluginPrefix = 'strapi-plugin-';
  const pluginID = `${pluginPrefix}${plugin}`;
  const pluginPath = `./plugins/${plugin}`;

  // Check that we're in a valid Strapi project.
  if (!cli.isStrapiApp()) {
    return logger.error('This command can only be used inside a Strapi project.');
  }

  // Check that the plugin is not installed yet.
  if (fs.existsSync(pluginPath)) {
    logger.error(`It looks like this plugin is already installed. Please check in \`${pluginPath}\`.`);
    process.exit(1);
  }

  const pluginInfo = await fetch(`${host}/plugin/${pluginID}`)
    .then(res => res.json())
    .catch(() => {
      return {};
    });

  if (pluginInfo.premium) {
    const config = await getConfig();

    if (!config.jwt) {
      console.log('⛔️ You have to be logged to install this plugin.');
      process.exit(1);
    }

    const pkg = require(path.join(process.cwd(), 'package'));

    const {available, token} = await fetch(`${host}/validation/${pkg.strapi.uuid}/${pluginID}`, {
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

    if (available !== true) {
      console.log('⛔️ You are not authorized to install this plugin.');
      process.exit();
    }

    await npmAuth(pluginInfo.registry, token);
  }

  // Progress message.
  logger.debug('Installation in progress...');

  if (cliArguments.dev) {
    try {
      fs.symlinkSync(path.resolve(__dirname, '..', '..', pluginID), path.resolve(process.cwd(), pluginPath), 'dir');

      logger.info('The plugin has been successfully installed.');
      process.exit(0);
    } catch (e) {
      logger.error('An error occurred during plugin installation.');
      process.exit(1);
    }
  } else {
    // Debug message.
    logger.debug('Installing the plugin from npm registry.');

    // Install the plugin from the npm registry.
    const isStrapiInstalledWithNPM = packageManager.isStrapiInstalledWithNPM();

    if (!isStrapiInstalledWithNPM) {
      // Create the directory yarn doesn't do it it
      shell.exec('mkdir', [pluginPath]);
      // Add a package.json so it installs the dependencies
      shell.touch(`${pluginPath}/package.json`);
      fs.writeFileSync(`${pluginPath}/package.json`, JSON.stringify({}), 'utf8');
    }

    const cmd = isStrapiInstalledWithNPM ? `npm install ${pluginID}@alpha --ignore-scripts --no-save --prefix ${pluginPath} --registry ${pluginInfo.registry}` : `yarn --cwd ${pluginPath} add ${pluginID}@alpha --ignore-scripts --no-save`;
    exec(cmd, (err) => {
      if (err) {
        logger.error(`An error occurred during plugin installation. \nPlease make sure this plugin is available on npm: ${pluginInfo.registry}/package/${pluginID}`);
        process.exit(1);
      }

      // Remove the created package.json needed for yarn
      if (!isStrapiInstalledWithNPM) {
        shell.rm('-r', `${pluginPath}/package.json`);
      }

      // Debug message.
      logger.debug('Plugin successfully installed from npm registry.');

      try {
        // Debug message.
        logger.debug(`Moving the \`node_modules/${pluginID}\` folder to the \`./plugins\` folder.`);
        // Move the plugin from the `node_modules` folder to the `./plugins` folder.
        fs.copySync(`${pluginPath}/node_modules/${pluginID}`, pluginPath, {
          overwrite: true,
          dereference: true,
        });
        // Copy .gitignore because the file is ignored during `npm publish`
        // and we need it to build the plugin.
        try {
          fs.accessSync(path.join(pluginPath, '.gitignore'));
        } catch (err) {
          if (err.code === 'ENOENT') {
            if (process.mainModule.filename.indexOf('yarn') !== -1) {
              fs.copySync(path.resolve(__dirname, '..', '..', 'strapi-generate-plugin', 'templates', 'gitignore'), path.join(pluginPath, '.gitignore'));
            } else {
              fs.copySync(path.resolve(__dirname, '..', 'node_modules', 'strapi-generate-plugin', 'templates', 'gitignore'), path.join(pluginPath, '.gitignore'));
            }
          }
        }

        // Success.
        logger.info('The plugin has been successfully installed.');
        process.exit(0);
      } catch (err) {
        logger.error('An error occurred during plugin installation.');
        process.exit(1);
      }
    });
  }
};
