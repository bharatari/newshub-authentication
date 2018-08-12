'use strict';

/* eslint eqeqeq: 0 */

const errors = require('@feathersjs/errors');
const moment = require('moment');
const _ = require('lodash');
const access = require('../../../utils/access');

module.exports = function (options) {
  return function (hook) {
    const models = hook.app.get('sequelize').models;
    const redis = hook.app.get('redis');

    if (!hook.data.organization_users) {
      hook.data.organization_users = {};
    }

    const { organization_users: { roles, title, disabled, options, meta, barcode } } = hook.data;

    // Check if currentOrganizationId is set instead of
    // doing this fragile skip check
    if (hook.params.skip) {
      return hook;  
    }

    let id;

    if (hook.method == 'create') {
      id = hook.result.id;
    } else {
      id = hook.id;
    }

    return models.user.findOne({
      where: {
        id,
      },
      include: [{
        model: models.organization,
        where: {
          '$organizations.organization_users.organizationId$': hook.params.user.currentOrganizationId,
        },
      }],
    }).then(async (user) => {
      const newOrganizationUsers = user.get('organizations')[0].organization_users;
      
      const currentRoles = user.get('organizations')[0].organization_users.roles;
  
      if (roles && (roles != currentRoles)) {
        const canUpdateRoles = await access.can(models, redis, hook.params.user.id, 'user', 'update', 'roles', hook.id);

        if (!canUpdateRoles) {
          throw new errors.Forbidden('You do not have the permission to update roles');
        } else {
          newOrganizationUsers.roles = roles;
        }
      }

      const currentTitle = user.get('organizations')[0].organization_users.title;

      if (!_.isNil(title) && !_.isEmpty(title) && (title != currentTitle)) {
        const canUpdateTitle = await access.can(models, redis, hook.params.user.id, 'user', 'update', 'title', hook.id);

        if (!canUpdateTitle) {
          throw new errors.Forbidden('You do not have the permission to update title');
        } else {
          newOrganizationUsers.title = title;
        }
      }

      const currentDisabled = user.get('organizations')[0].organization_users.disabled;

      if (!_.isNil(disabled) && (disabled != currentDisabled)) {
        const canDisable = await access.can(models, redis, hook.params.user.id, 'user', 'update', 'disabled', hook.id);

        if (!canDisable) {
          throw new errors.Forbidden('You do not have the permission to update disabled status');
        } else {
          newOrganizationUsers.disabled = disabled;
        }
      }

      const currentBarcode = user.get('organizations')[0].organization_users.barcode;

      if (!_.isNil(barcode) && (barcode != currentBarcode)) {
        const canUpdateBarcode = await access.can(models, redis, hook.params.user.id, 'user', 'update', 'barcode', hook.id);

        if (!canUpdateBarcode) {
          throw new errors.Forbidden('You do not have the permission to update disabled status');
        } else {
          newOrganizationUsers.barcode = barcode;
        }
      }

      const currentOptions = user.get('organizations')[0].organization_users.options;

      if (options) {
        const canUpdateDeviceManager = await access.can(models, redis, hook.params.user.id, 'user', 'update', 'options.deviceManager', hook.id);
      
        if (!_.isNil(options.deviceManager) && (options.deviceManager != currentOptions.deviceManager)) {
          if (!canUpdateDeviceManager) {
            throw new errors.Forbidden('You do not have permission to update device manager status');
          } else {
            newOrganizationUsers.set('options.deviceManager', options.deviceManager);
          }
        }
      }

      const currentMeta = user.get('organizations')[0].organization_users.meta;

      if (meta) {
        const canUpdateCode = await access.can(models, redis, hook.params.user.id, 'user', 'update', 'meta.code', hook.id);
        const canUpdateNotes = await access.can(models, redis, hook.params.user.id, 'user', 'update', 'meta.notes', hook.id);

        if (!_.isNil(meta.code) && (meta.code != currentMeta.code)) {
          if (!canUpdateCode) {
            throw new errors.Forbidden('You do not have permission to update user code');
          } else {
            newOrganizationUsers.set('meta.code', meta.code);
          }
        }

        if (!_.isNil(meta.notes) && (meta.notes != currentMeta.notes)) {
          if (!canUpdateNotes) {
            throw new errors.Forbidden('You do not have permission to update notes');
          } else {
            newOrganizationUsers.set('meta.notes', meta.notes);
          }
        }
      }

      // Update organization_user details manually
      const organization = await user.getOrganizations({
        where: {
          id: hook.params.user.currentOrganizationId
        }
      });

      organization[0].organization_users = newOrganizationUsers;

      await organization[0].organization_users.save();

      delete hook.data.organization_users;

      return hook;
    }).catch((err) => {
      throw err;
    });
  };
};
