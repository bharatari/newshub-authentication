'use strict';

const userUtils = require('../../user/utils');
const roles = require('../../../utils/roles');

module.exports = function (options) {
  return function (hook) {
    const models = hook.app.get('sequelize').models;
    const redis = hook.app.get('redis');

    if (hook.params.provider) {
      if (hook.type === 'before') {
        if (!roles.has(models, redis, hook.params.user.id, 'user:view-disabled')) {
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
