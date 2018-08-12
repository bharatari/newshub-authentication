'use strict';

module.exports = function (options) {
  return async function (hook) {
    const role = hook.params.query.role;
    const roles = hook.params.query.roles;
    const service = hook.params.query.service;
    const method = hook.params.query.method;
    const property = hook.params.query.property;
    const id = hook.params.query.id;

    hook.data = {
      role,
      roles,
      service,
      method,
      property,
      id,
    };

    delete hook.params.query.role;
    delete hook.params.query.roles;
    delete hook.params.query.service;
    delete hook.params.query.method;
    delete hook.params.query.property;
    delete hook.params.query.id;

    return hook;
  };
};
