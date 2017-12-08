'use strict';

const errors = require('@feathersjs/errors');

module.exports = function (options) {
  return async function (hook) {
    await hook.result.addOrganization(hook.result.currentOrganizationId, { through: { roles: null }});

    return hook;
  };
};
