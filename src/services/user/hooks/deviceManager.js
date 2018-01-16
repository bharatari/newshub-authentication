'use strict';

const errors = require('@feathersjs/errors');
const modelUtils = require('../../../utils/models');

module.exports = function (options) {
  return async function (hook) {
    if (hook.params.query) {
      if (hook.params.query.deviceManager != null) {
        if (hook.params.query.deviceManager === 'true') {
          hook.params.sequelize =  modelUtils.mergeQuery(hook.params.sequelize, {
            options: {
              deviceManager: true,
            },
          });
        } else {
          hook.params.sequelize = modelUtils.mergeQuery(hook.params.sequelize, {
            options: {
              deviceManager: {
                $not: true,
              },
            },
          });
        }

        delete hook.params.query.deviceManager;
      }
    }    
  };
};
