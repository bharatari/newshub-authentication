'use strict';

const userUtils = require('../../user/utils');
const errors = require('feathers-errors');
const _ = require('lodash');

module.exports = function (options) {
  return function (hook) {
    console.log(hook.params.user);
    console.log(userUtils.isMaster(hook.params.user));
    if (userUtils.isMaster(hook.params.user)) {
      return hook;
    } else {
      throw new errors.NotAuthenticated('Must be a master user to create a device.');
    }
  };
};
