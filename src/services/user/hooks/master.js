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
    }).then(async (user) => {
      if (roles && (roles != user.roles)) {
        const canUpdateRoles = await roles.can(models, redis, hook.params.user.id, 'user', 'update', 'roles');

        if (canUpdateRoles) {
          return hook;
        } else {
          throw new errors.NotAuthenticated('You do not have the permission to update roles');
        }
      }

      if (!_.isNil(disabled) && (disabled != user.disabled)) {
        const canDisable = await roles.can(models, redis, hook.params.user.id, 'user', 'update', 'disabled');

        if (canDisable) {
          return hook;
        } else {
          throw new errors.NotAuthenticated('You do not have the permission to update disabled status');
        }
      }

      if (options) {
        const canUpdateDoNotDisturb = await roles.can(models, redis, hook.params.user.id, 'user', 'update', 'doNotDisturb');

        if (user.options) {
          if (!_.isNil(options.doNotDisturb) && (options.doNotDisturb != user.options.doNotDisturb)) {            
            if (canUpdateDoNotDisturb) {
              return hook;
            } else {
              throw new errors.NotAuthenticated('You do not have the permission to update do not disturb status');
            }
          }
        } else if (!_.isNil(options.doNotDisturb)) {
          if (canUpdateDoNotDisturb) {
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
