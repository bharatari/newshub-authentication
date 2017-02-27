'use strict';

const errors = require('feathers-errors');
const access = require('../../../utils/access');

module.exports = function (options) {
  return async function (hook) {
    const models = hook.app.get('sequelize').models;
    const redis = hook.app.get('redis');

    if (access.isPermission(hook.params.query.role)) {
      const result = await access.has(models, hook.params.user.id, hook.params.query.role);

      hook.result = result;

      return hook;
    } else if (access.isRole(hook.params.query.permission)) {
      const result = await access.is(models, hook.params.user.id, hook.params.query.role);

      hook.result = result;

      return hook;
    } else {
      hook.result = false;

      return hook;
    }
  };
};
