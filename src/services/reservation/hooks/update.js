'use strict';

const utils = require('../utils');
const errors = require('feathers-errors');
const access = require('../../../utils/access');

module.exports = function (options) {
  return function (hook) {
    if (hook.method === 'update') {
      const models = hook.app.get('sequelize').models;
      const redis = hook.app.get('redis');
      
      const hasAccess = access.check(models, redis, hook.params.user.id, 'reservation', hook.method, )

      // check fields that user can edit
      // take into account owner and admin status
    }

    return hook;
  };
};
