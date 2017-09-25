'use strict';

const modelUtils = require('../../../utils/models');

module.exports = function (options) {
  return function (hook) {
    const models = hook.app.get('sequelize').models;

    if (hook.type === 'before') {
      const include = [{
        model: models.organization,
      }, {
        model: models.organization,
        as: 'currentOrganization',
      }];

      const where = hook.params.query;
    
      hook.params.sequelize = modelUtils.mergeQuery(hook.params.sequelize, where, include);
    }

    console.log(hook.params.sequelize);

    return hook;
  };
};
