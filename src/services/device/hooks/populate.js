'use strict';

const modelUtils = require('../../../utils/models');

module.exports = function (options) {
  return function (hook) {
    const models = hook.app.get('sequelize').models;

    if (hook.type === 'before') {
      const include = [{
        model: models.image,
        as: 'thumbnail',
      }];

      hook.params.sequelize = modelUtils.mergeQuery(hook.params.sequelize, null, include);
    }

    return hook;
  };
};
