'use strict';

module.exports = function (options) {
  return async function (hook) {
    const role = hook.params.query.role;
    const roles = hook.params.query.roles;

    hook.data = {
      role,
      roles,
    };

    delete hook.params.query.role;
    delete hook.params.query.roles;

    return hook;
  };
};
