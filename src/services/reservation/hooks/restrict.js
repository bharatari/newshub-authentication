'use strict';

const errors = require('@feathersjs/errors');

module.exports = function (options) {
  return function (hook) {
    const {
      approved,
      checkedOut,
      checkedIn,
      adminNotes,
      disabled,
      approvedById,
      checkedOutById,
      checkedInById
    } = hook.data;

    if (approved || checkedOut || checkedIn || adminNotes || disabled || approvedById || checkedOutById || checkedInById) {
      throw new errors.BadRequest('Cannot set reservation status on creation');
    }

    return hook;
  };
};
