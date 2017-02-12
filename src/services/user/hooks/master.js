'use strict';

const userUtils = require('../../user/utils');
const errors = require('feathers-errors');
const moment = require('moment');
const _ = require('lodash');

module.exports = function (options) {
  return function (hook) {
    const models = hook.app.get('sequelize').models;
    const { roles, disabled, options } = hook.data;

    if (userUtils.isMaster(hook.params.user)) {
      return hook;
    } else if (hook.id == hook.params.user.id) {
      return models.user.findOne({
        where: {
          id: hook.id,
        },
      }).then(function (user) {
        if (roles && (roles != user.roles)) {
          throw new errors.NotAuthenticated('Must be a master user to update roles');
        }

        if (!_.isNil(disabled) && (disabled != user.disabled)) {
          throw new errors.NotAuthenticated('Must be a master user to update disabled status');
        }

        if (options) {
          if (user.options) {
            if (!_.isNil(options.doNotDisturb) && (options.doNotDisturb != user.options.doNotDisturb)) {
              throw new errors.NotAuthenticated('Must be a master user to update do not disturb status');
            }
          } else {
            if (!_.isNil(options.doNotDisturb)) {
              throw new errors.NotAuthenticated('Must be a master user to update do not disturb status');
            }
          }
        }
      }).catch(function (err) {
        throw err;
      });
    } else {
      throw new errors.NotAuthenticated('Must own this user or be a master user.');
    }
  };
};
