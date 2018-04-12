'use strict';

const Chance = require('chance');
const chance = new Chance();
const moment = require('moment');
const errors = require('@feathersjs/errors');
const access = require('../../../utils/access');

module.exports = function (options) {
  return async function (hook) {
    const models = hook.app.get('sequelize').models;
    const redis = hook.app.get('redis');
    const userId = hook.params.user.id;

    const canCreateUser = await access.has(models, redis, userId, 'user:create');
    
    if (canCreateUser) {
      return hook;
    } else {
      throw new errors.Forbidden();
    }
  };
};
