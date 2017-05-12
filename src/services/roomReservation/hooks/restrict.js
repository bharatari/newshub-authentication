'use strict';

const errors = require('feathers-errors');

module.exports = function (options) {
  return function (hook) {
    const { approved, checkedOut, checkedIn, adminNotes, disabled } = hook.data;

    if (approved || checkedOut || checkedIn || adminNotes || disabled) {
      throw new errors.BadRequest('Cannot set reservation status on creation');
    }

    return hook;
  };
};
