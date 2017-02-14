'use strict';

const userUtils = require('../../user/utils');
const errors = require('feathers-errors');
const _ = require('lodash');

module.exports = function (options) {
  return function (hook) {
    if (userUtils.isMaster(hook.params.user)) {
      return hook;
    }
    throw new errors.NotAuthenticated('Must be a master user to create a device.');
  };
};
