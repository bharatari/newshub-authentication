'use strict';

const errors = require('@feathersjs/errors');
const modelUtils = require('../../../utils/models');

module.exports = function (options) {
  return async function (hook) {
    const models = hook.app.get('sequelize').models;
    const user = hook.params.user;

    if (hook.params.query) {
      if (hook.params.query.barcode != null) {
        // Clearing and replacing this
        // means you can't filter by barcode and
        // deviceManager at the same time
        hook.params.sequelize.include = [];

        hook.params.sequelize = modelUtils.mergeQuery(hook.params.sequelize, null,
          [{
            model: models.organization,
            through: {
              where: {
                organizationId: user.currentOrganizationId,
                barcode: hook.params.query.barcode,
              }
            }
          }]
        );

        delete hook.params.query.barcode;
      }
    }    
  };
};
