'use strict';

/* eslint eqeqeq: 0 */

const errors = require('@feathersjs/errors');
const moment = require('moment');
const _ = require('lodash');
const access = require('../../../utils/access');

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
        const canAddOrganization = await access.has(models, redis, adminId, 'user:create');

        if (canAddOrganization) {
          const user = await models.user.findOne({
            where: {
              id: hook.id,
            },
          });

          await user.addOrganization(organizationId, { through: { roles: null }});
          
          delete hook.data.organizationId;

          hook.params.skip = true;
          
          hook.result = {
            organizationId,
          };
          
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
