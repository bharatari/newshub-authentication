'use strict';

const errors = require('@feathersjs/errors');
const _ = require('lodash');
const access = require('../../../utils/access');

module.exports = function (options) {
  return async function (hook) {
    const models = hook.app.get('sequelize').models;
    const redis = hook.app.get('redis');
    
    const organizationId = hook.params.user.currentOrganizationId;

    if (!_.isNil(organizationId)) {
      const adminId = hook.params.user.id;
      const userId = hook.id;

      try {
        const canAddOrganization = await access.has(models, redis, adminId, 'user:create');

        if (canAddOrganization) {
          await hook.result.addOrganization(organizationId);

          hook.result.currentOrganizationId = organizationId;

          hook.result.save();
          
          return hook;
        } else {
          throw new errors.Forbidden();
        }
      } catch (e) {
        throw e;
      }
    } else {
      return hook;
    }
  };
};
