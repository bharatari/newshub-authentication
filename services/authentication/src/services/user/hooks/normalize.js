'use strict';

const errors = require('@feathersjs/errors');
const _ = require('lodash');
const general = require('../../../utils/general');

module.exports = function (options) {
  return function (hook) {
    if (hook.data.email) {
      if (_.isString(hook.data.email)) {
        hook.data.email = general.cleanString(hook.data.email);
      } else {
        return errors.BadRequest();
      }
    } else {
      return errors.BadRequest();
    }
  };
};
