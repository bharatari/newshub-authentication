'use strict';

const userUtils = require('../../user/utils');
const access = require('../../../utils/access');

module.exports = function (options) {
  return async function (hook) {
    const models = hook.app.get('sequelize').models;
    const redis = hook.app.get('redis');

    if (hook.params.provider) {
      if (hook.type === 'before') {
        const canViewDisabled = await access.has(models, redis, hook.params.user.id, 'user:view-disabled')

        if (!canViewDisabled) {
          hook.params.sequelize = {
            where: {
              disabled: false,
            },
          };
        } else {
          hook.params.sequelize = {};
        }
      }
    }

    return hook;
  };
};
