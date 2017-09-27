'use strict';

const access = require('../../../utils/access');
const modelUtils = require('../../../utils/models');

module.exports = function (options) {
  return async function (hook) {
    const models = hook.app.get('sequelize').models;
    const redis = hook.app.get('redis');

    if (hook.params.provider) {
      if (hook.type === 'before') {
        const canViewDisabled = await access.has(models, redis, hook.params.user.id, 'user:view-disabled')

        if (!canViewDisabled) {
          hook.params.sequelize = modelUtils.mergeQuery(hook.params.sequelize, {
            where: {
              disabled: false,
            },
          });
        }
      }
    }

    return hook;
  };
};
