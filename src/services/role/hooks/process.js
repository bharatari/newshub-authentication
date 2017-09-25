'use strict';

const errors = require('feathers-errors');
const access = require('../../../utils/access');

module.exports = function (options) {
  return async function (hook) {
    const models = hook.app.get('sequelize').models;
    const redis = hook.app.get('redis');

    const userId = hook.params.user.id;
    const service = hook.data.service;
    const method = hook.data.method;
    const property = hook.data.property;
    const id = hook.data.id;

    const role = hook.data.role;

    const roles = hook.data.roles;

    if (role) {
      if (access.isPermission(role)) {
        const result = await access.has(models, redis, userId, role);

        hook.result = result;

        return hook;
      } else if (access.isRole(role)) {
        const result = await access.is(models, redis, userId, role);

        hook.result = result;

        return hook;
      } else {
        hook.result = false;

        return hook;
      }
    } else if (service) {
      const result = await access.can(models, redis, userId, service, method, property, id);

      if (result) {
        hook.result = result;

        return hook;
      } else {
        throw new errors.Forbidden();
      }
    } else if (roles === 'all') {
      const userRoles = await access.resolve(models, redis, userId);

      hook.result = userRoles;

      return hook;
    } else {
      return hook;
    }
  };
};
