'use strict';

// Add any common hooks you want to share across services in here.
//
// Below is an example of how a hook is written and exported. Please
// see http://docs.feathersjs.com/hooks/readme.html for more details
// on hooks.

const access = require('../utils/access');
const errors = require('feathers-errors');

exports.checkAccess = function (options) {
  return function (hook) {
    const models = hook.app.get('sequelize').models;
    const redis = hook.app.get('redis');

    if (hook.type === 'before') {
      return access.can(models, redis, hook.params.user.id, options.service, hook.method)
        .then((result) => {
          if (result) {
            return hook;
          }

          throw new errors.NotAuthenticated();
        })
        .catch((err) => {
          throw err;
        });
    }

    return hook;
  };
};
