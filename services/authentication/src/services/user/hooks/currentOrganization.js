'use strict';

const errors = require('@feathersjs/errors');
const utils = require('../utils');

module.exports = function (options) {
  return function (hook) {
    if (hook.method === 'get') {
      hook.result = utils.includeOrganizationUser(hook.result);
    } else if (hook.method === 'find') {
      hook.result = utils.includeOrganizationUserBatch(hook.result);
    }

    return hook;
  };
};
