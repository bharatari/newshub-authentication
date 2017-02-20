'use strict';

/* eslint eqeqeq: 0 */

const userUtils = require('../../user/utils');
const errors = require('feathers-errors');
const moment = require('moment');
const _ = require('lodash');
const roles = require('../../../utils/roles');

module.exports = function (options) {
  return function (hook) {
    const models = hook.app.get('sequelize').models;
    const redis = hook.app.get('redis');
    const { roles, disabled, options } = hook.data;

    return models.user.findOne({
      where: {
        id: hook.id,
      },
    }).then((user) => {
      if (roles && (roles != user.roles)) {
        if (roles.can(models, redis, hook.params.user.id, 'user', 'update', 'roles')) {
          return hook;
        } else {
          throw new errors.NotAuthenticated('You do not have the permission to update roles');
        }
      }

      if (!_.isNil(disabled) && (disabled != user.disabled)) {
        if (roles.can(models, redis, hook.params.user.id, 'user', 'update', 'disabled')) {
          return hook;
        } else {
          throw new errors.NotAuthenticated('You do not have the permission to update disabled status');
        }
      }

      if (options) {
        if (user.options) {
          if (!_.isNil(options.doNotDisturb) && (options.doNotDisturb != user.options.doNotDisturb)) {
            if (roles.can(models, redis, hook.params.user.id, 'user', 'update', 'doNotDisturb')) {
              return hook;
            } else {
              throw new errors.NotAuthenticated('You do not have the permission to update do not disturb status');
            }
          }
        } else if (!_.isNil(options.doNotDisturb)) {
          if (roles.can(models, redis, hook.params.user.id, 'user', 'update', 'doNotDisturb')) {
            return hook;
          } else {
            throw new errors.NotAuthenticated('You do not have the permission to update do not disturb status');
          }
        }
      }
    }).catch((err) => {
      throw err;
    });
  };
};
