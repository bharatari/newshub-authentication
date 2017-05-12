'use strict';

const errors = require('feathers-errors');
const access = require('../../../utils/access');

module.exports = function (options) {
  return async function (hook) {
    const models = hook.app.get('sequelize').models;
    const redis = hook.app.get('redis');

    const role = hook.data.role;
    const roles = hook.data.roles;

    if (role) {
      if (access.isPermission(role)) {
        const result = await access.has(models, hook.params.user.id, role);

        hook.result = result;

        return hook;
      } else if (access.isRole(role)) {
        const result = await access.is(models, hook.params.user.id, role);

        hook.result = result;

        return hook;
      } else {
        hook.result = false;

        return hook;
      }
    } else if (roles === 'all') {
      const userRoles = await access.resolve(models, redis, hook.params.user.id);

      hook.result = userRoles;

      return hook;
    } else {
      return hook;
    }
  };
};
