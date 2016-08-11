'use strict';

const errors = require('feathers-errors');
const _ = require('lodash');

module.exports = function (options) {
  return function (hook) {
    if (hook.data.username) {
      if (_.isString(hook.data.username)) {
        hook.data.username = hook.data.username.toLowerCase().trim();
      } else {
        return errors.BadRequest();
      }
    } else {
      return errors.BadRequest();
    }
  };
};
