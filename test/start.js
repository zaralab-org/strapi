const _ = require('lodash');
const exec = require('child_process').exec;
const fs = require('fs-extra');
const path = require('path');
const mongoose = require(`mongoose`);
const Admin = mongoose.mongo.Admin;
const Mongoose = require('mongoose').Mongoose;

const strapiBin = path.resolve('./packages/strapi/bin/strapi.js');
const appName = 'testApp';

const databases = {
  mongo: `--dbclient=mongo --dbhost=127.0.0.1 --dbport=27017 --dbname=strapi-test-${new Date().getTime()} --dbusername="" --dbpassword=""`,
  postgres: `--dbclient=postgres --dbhost=127.0.0.1 --dbport=5432 --dbname=strapi-test --dbusername="" --dbpassword=""`,
  mysql: `--dbclient=mysql --dbhost=127.0.0.1 --dbport=3306 --dbname=strapi-test --dbusername="root" --dbpassword="root"`
};

const fastMode = process.env.npm_config_fast === 'true';

const { runCLI: jest } = require('jest-cli/build/cli');

const main = async () => {
  const clean = async (type) => {
    // Drop MongoDB test databases.
    if (type === 'mongo') {
      try {
        const instance = new Mongoose();
        const connection = await instance.connect('mongodb://localhost');
        const databases = await new Admin(instance.connection.db).listDatabases();

        const arrayOfPromises = databases.databases
          .filter(db => db.name.indexOf('strapi-test-') !== -1)
          .map(db => new Promise((resolve, reject) => {
            const instance = new Mongoose();

            instance.connect(`mongodb://localhost/${db.name}`, (err) => {
              if (err) {
                return reject(err);
              }

              instance.connection.db.dropDatabase();

              resolve();
            });
          }));

        await Promise.all(arrayOfPromises);
      } catch (e) {
        // Silent.
      }
    }

    return new Promise((resolve) => {
      fs.exists(`${appName}_${type}`, exists => {
        if (exists) {
          fs.removeSync(`${appName}_${type}`);
        }

        resolve();
      });
    });
  };

  const generate = (database, type) => {
    return new Promise((resolve, reject) => {
      const appCreation = exec(
        `node ${strapiBin} new ${appName}_${type} --dev ${database} `,
        { stdio: 'inherit' }
      );

      appCreation.stdout.on('data', data => {
        console.log(_.trim(data.toString()));

        if (data.includes('is ready at')) {
          appCreation.kill();
          return resolve();
        }

        if (data.includes('Database connection has failed')) {
          appCreation.kill();
          return reject();
        }
      });
    });
  };

  const start = (type, port) => {
    return new Promise((resolve) => {
      const appStart = exec(
        `node ${strapiBin} start --path=${appName}_${type} --port=${}`,
        { stdio: 'inherit' }
      );

      appStart.stdout.on('data', data => {
        console.log(_.trim(data.toString()));

        if (data.includes('To shut down your server')) {
          return resolve(appStart);
        }
      });
    });
  };
  
  const test = async (port) => {
    console.log();
    console.log('🏁 🏁 🏁 🏁 🏁');
    console.log();

    return new Promise(async (resolve) => {
      const options = {
        projects: [process.cwd()],
        silent: false,
        globals: {
          "__PORT__": port
        }
      };

      await jest(options, options.projects);

      resolve();
    });
  };

  const testProcess = async (database, type, port) => {
    try {
      if (!fastMode) {
        await clean(type);
        await generate(database, type);
      }
     
      const appStart = await start(type, port);
      await test(port);

      appStart.kill();
    } catch (e) {
      console.log(e);
      process.exit(0);
    }
  };

  await testProcess(databases.mongo, 'mongo', Math.floor((Math.random() * 3000) + 1500));
  await testProcess(databases.postgres, 'pg', Math.floor((Math.random() * 3000) + 1500));
  await testProcess(databases.mysql, 'mysql', Math.floor((Math.random() * 3000) + 1500));
};

main();