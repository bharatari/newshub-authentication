'use strict';

const errors = require('@feathersjs/errors');
const _ = require('lodash');

module.exports = function (options) {
  return async function (hook) {
    const models = hook.app.get('sequelize').models;
    const redis = hook.app.get('redis');
    const { organizationId } = hook.data;

    if (!_.isNil(organizationId) && hook.method === 'patch') {
      const adminId = hook.params.user.id;
      const userId = hook.id;

      if (hook.params.user.currentOrganizationId !== organizationId) {
        throw new errors.Forbidden();
      }

      try {
        const canAddOrganization = await access.has(models, redis, adminId, 'user:add-organization');

        if (canAddOrganization) {
          await hook.result.addOrganization(hook.result.currentOrganizationId, { through: { roles: null }});
          
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
