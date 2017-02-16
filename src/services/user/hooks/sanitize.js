'use strict';

const userUtils = require('../../user/utils');

module.exports = function (options) {
  return function (hook) {
    if (hook.params.provider) {
      if (hook.type === 'before') {
        if (!userUtils.isAdmin(hook.params.user)) {
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
