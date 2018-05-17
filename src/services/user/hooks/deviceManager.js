'use strict';

const errors = require('@feathersjs/errors');
const modelUtils = require('../../../utils/models');

module.exports = function (options) {
  return async function (hook) {
    const models = hook.app.get('sequelize');
    const user = hook.params.user;

    if (hook.params.query) {
      if (hook.params.query.deviceManager != null) {
        if (hook.params.query.deviceManager === 'true') {
          hook.params.sequelize = modelUtils.mergeQuery(hook.params.sequelize, null,
            [{
              model: models.organization_user,
              where: {
                organizationId: user.currentOrganizationId,
                options: {
                  deviceManager: true,
                },
              }
            }]
          );
        } else {
          hook.params.sequelize = modelUtils.mergeQuery(hook.params.sequelize, null,
            [{
              model: models.organization_user,
              where: {
                organizationId: user.currentOrganizationId,
                options: {
                  deviceManager: {
                    $not: true,
                  },
                },
              }
            }]
          );
        }

        delete hook.params.query.deviceManager;
      }
    }    
  };
};
