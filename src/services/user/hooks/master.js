'use strict';

/* eslint eqeqeq: 0 */

const errors = require('feathers-errors');
const moment = require('moment');
const _ = require('lodash');
const access = require('../../../utils/access');

module.exports = function (options) {
  return function (hook) {
    const models = hook.app.get('sequelize').models;
    const redis = hook.app.get('redis');
    const { roles, disabled, options } = hook.data;

    return models.user.findOne({
      where: {
        id: hook.id,
      },
      include: [{
        model: models.organization,
        where: {
          '$organizations.organization_user.organizationId$': hook.params.user.currentOrganizationId,
        },
      }],
    }).then(async (user) => {
      const currentRoles = user.get('organizations')[0].organization_user.roles;

      if (roles && (roles != currentRoles)) {
        const canUpdateRoles = await access.can(models, redis, hook.params.user.id, 'user', 'update', 'roles');

        if (canUpdateRoles) {
          const organization = await user.getOrganizations({
            where: {
              id: hook.params.user.currentOrganizationId
            }
          });

          organization[0].organization_user.roles = hook.data.roles;

          await organization[0].organization_user.save();
  
          delete hook.data.roles;
        } else {
          throw new errors.NotAuthenticated('You do not have the permission to update roles');
        }
      }

      if (!_.isNil(disabled) && (disabled != user.disabled)) {
        const canDisable = await access.can(models, redis, hook.params.user.id, 'user', 'update', 'disabled');

        if (!canDisable) {
          throw new errors.NotAuthenticated('You do not have the permission to update disabled status');
        }
      }

      if (options) {
        const canUpdateDoNotDisturb = await access.can(models, redis, hook.params.user.id, 'user', 'update', 'doNotDisturb');

        if (user.options) {
          if (!_.isNil(options.doNotDisturb) && (options.doNotDisturb != user.options.doNotDisturb)) {            
            if (!canUpdateDoNotDisturb) {
              throw new errors.NotAuthenticated('You do not have the permission to update do not disturb status');
            }
          }
        } else if (!_.isNil(options.doNotDisturb)) {
          if (!canUpdateDoNotDisturb) {
            throw new errors.NotAuthenticated('You do not have the permission to update do not disturb status');
          }
        }
      }

      return hook;
    }).catch((err) => {
      throw err;
    });
  };
};
