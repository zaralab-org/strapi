'use strict';

/**
 * Module dependencies
 */

// Public node modules.
const _ = require('lodash');
const path = require('path');
const glob = require('glob');
const { ApolloServer } = require('apollo-server-koa');
const { RedisCache } = require('apollo-server-cache-redis');

const depthLimit = require('graphql-depth-limit');

const { SubscriptionServer } = require('subscriptions-transport-ws');
const { execute, subscribe } = require('graphql');

module.exports = strapi => {
  return {
    beforeInitialize: async function() {
      // Try to inject this hook just after the others hooks to skip the router processing.
      if (!_.get(strapi.config.hook.load, 'after')) {
        _.set(strapi.config.hook.load, 'after', []);
      }

      strapi.config.hook.load.after.push('graphql');

      // Load core utils.
      const utils = require(path.resolve(
        strapi.config.appPath,
        'node_modules',
        'strapi',
        'lib',
        'utils'
      ));

      // Set '*.graphql' files configurations in the global variable.
      await Promise.all([
        // Load root configurations.
        new Promise((resolve, reject) => {
          glob(
            './config/*.graphql?(.js)',
            {
              cwd: strapi.config.appPath,
            },
            (err, files) => {
              if (err) {
                return reject(err);
              }

              utils.loadConfig
                .call(strapi, files, true)
                .then(resolve)
                .catch(reject);
            }
          );
        }),
        // Load APIs configurations.
        new Promise((resolve, reject) => {
          glob(
            './api/*/config/*.graphql?(.js)',
            {
              cwd: strapi.config.appPath,
            },
            (err, files) => {
              if (err) {
                return reject(err);
              }

              utils.loadConfig
                .call(strapi, files, true)
                .then(resolve)
                .catch(reject);
            }
          );
        }),
        // Load plugins configurations.
        new Promise((resolve, reject) => {
          glob(
            './plugins/*/config/*.graphql?(.js)',
            {
              cwd: strapi.config.appPath,
            },
            (err, files) => {
              if (err) {
                return reject(err);
              }

              utils.loadConfig
                .call(strapi, files, true)
                .then(resolve)
                .catch(reject);
            }
          );
        }),
      ]);

      /*
       * Create a merge of all the GraphQL configuration.
       */

      // Set path with initial state.
      _.set(strapi.plugins.graphql, 'config._schema.graphql', {
        definition: '',
        query: '',
        mutation: '',
        subscription: '',
        type: {},
        resolver: {},
      });

      // Merge user API.
      Object.keys(strapi.api || {}).reduce((acc, current) => {
        const { definition, query, mutation, subscription, type, resolver } = _.get(
          strapi.api[current],
          'config.schema.graphql',
          {}
        );

        acc.definition += definition || '';
        acc.query += query || '';
        acc.mutation += mutation || '';
        acc.subscription += subscription || '';

        return _.merge(acc, {
          type,
          resolver,
        });
      }, strapi.plugins.graphql.config._schema.graphql);

      // Merge plugins API.
      Object.keys(strapi.plugins || {}).reduce((acc, current) => {
        const { definition, query, mutation, subscription, type, resolver } = _.get(
          strapi.plugins[current],
          'config.schema.graphql',
          {}
        );

        acc.definition += definition || '';
        acc.query += query || '';
        acc.mutation += mutation || '';
        acc.subscription += subscription || '';

        return _.merge(acc, {
          type,
          resolver,
        });
      }, strapi.plugins.graphql.config._schema.graphql);
    },

    initialize: function(cb) {
      const { typeDefs, resolvers } = strapi.plugins.graphql.services.schema.generateSchema();

      if (_.isEmpty(typeDefs)) {
        strapi.log.warn('GraphQL schema has not been generated because it\'s empty');

        return cb();
      }

      const serverParams = {
        typeDefs,
        resolvers,
        context: ({ ctx }) => {
          // Initiliase loaders for this request.
          strapi.plugins.graphql.services.loaders.initializeLoader();

          return {
            context: ctx,
          };
        },
        validationRules: [depthLimit(strapi.plugins.graphql.config.depthLimit)],
        tracing: _.get(strapi.plugins.graphql, 'config.tracing', false),
        playground: false
      };

      // Disable GraphQL Playground in production environment.
      if (
        strapi.config.environment !== 'production' ||
        strapi.plugins.graphql.config.playgroundAlways
      ) {
        serverParams.playground = {
          endpoint: strapi.plugins.graphql.config.endpoint,
          subscriptionEndpoint: strapi.plugins.graphql.config.endpoint
        };

        serverParams.introspection = true;
      } else if (['production', 'staging'].indexOf(process.env.NODE_ENV) >= 0) {
        serverParams.cache = new RedisCache({
          host: strapi.config.hook.settings.redis.host,
          port: strapi.config.hook.settings.redis.port,
          password: strapi.config.hook.settings.redis.password,
          db: strapi.config.hook.settings.redis.options.db
          // Options are passed through to the Redis client
        });
      }

      const server = new ApolloServer(serverParams);

      server.applyMiddleware({
        app: strapi.app,
        path: strapi.plugins.graphql.config.endpoint,
      });

      SubscriptionServer.create({
          schema: server.schema,
          execute,
          subscribe,
          onConnect: async (connectionParams, webSocket) => {
            let _id, id;

            try{
              let jwt = await strapi.plugins['users-permissions'].services.jwt.verify(connectionParams.authToken);
              _id = jwt._id;
              id = jwt.id;
            }
            catch(err){
              return;
            }
      
            const populate = strapi.plugins['users-permissions'].models.user.associations
            .filter(ast => ast.autoPopulate !== false)
            .map(ast => ast.alias);
      
            let user = (await strapi.plugins['users-permissions'].services.user.fetchAll({ _id, id }, populate))[0];
        
            if (!user) {
              return;
            }
        
            if (user.role.type === 'root') {
              return Promise.resolve({
                state: {
                  user
                }
              });
            }
        
            const store = await strapi.store({
              environment: '',
              type: 'plugin',
              name: 'users-permissions'
            });
        
            if (_.get(await store.get({key: 'advanced'}), 'email_confirmation') && !user.confirmed) {
              throw new Error('Auth.form.error.confirmed');
            }
        
            if (user.blocked) {
              throw new Error('Auth.form.error.blocked');
            }
            return Promise.resolve({
              state: {
                user
              }
            });
          },
          onOperation: (message, params, webSocket) => {
            return params;
          },
          onOperationComplete: webSocket => {
            // ...
          },
          onDisconnect: (webSocket, context) => {
            // ...
          },
        },
        {
          server: strapi.server,
          path: strapi.plugins.graphql.config.endpoint
        },
      );

      cb();
    },
  };
};
