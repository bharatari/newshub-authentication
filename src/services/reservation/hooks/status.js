'use strict';

const user = require('../../user/utils');
const errors = require('feathers-errors');
const email = require('../../../utils/email');

module.exports = function (options) {
  return function (hook) {
    const models = hook.app.get('sequelize').models;
    const { approved, checkedOut, checkedIn, adminNotes, disabled } = hook.data;

    if (approved || checkedOut || checkedIn || adminNotes || disabled) {
      return models.reservation.findOne({
        where: {
          id: hook.id,
        },
        include: [{
          model: models.user,
        }],
      }).then(function (reservation) {
        if (approved && !reservation.approved) {
          if (user.isAdmin(hook.params.user)) {
            hook.data.approvedById = hook.params.user.id;

            return email.sendEmail(hook.app, reservation.user.email, null, 'approved', 'USER_RESERVATION_RESPONSE')
              .then(function (response) {
                return hook;
              }).catch(function (err) {
                // Don't throw error just because email didn't send
                return hook;
              });
          } else {
            throw new errors.NotAuthenticated('Must be an admin to update reservation status.');
          }
        }

        if (checkedOut && !reservation.checkedOut) {
          if (user.isAdmin(hook.params.user)) {
            hook.data.checkedOutById = hook.params.user.id;

            return email.sendEmail(hook.app, reservation.user.email, null, 'checked out', 'USER_RESERVATION_RESPONSE')
              .then(function (response) {
                return hook;
              }).catch(function (err) {
                // Don't throw error just because email didn't send
                return hook;
              });
          } else {
            throw new errors.NotAuthenticated('Must be an admin to update reservation status.');
          }
        }

        if (checkedIn && !reservation.checkedIn) {
          if (user.isAdmin(hook.params.user)) {
            hook.data.checkedInById = hook.params.user.id;

            return email.sendEmail(hook.app, reservation.user.email, null, 'checked in', 'USER_RESERVATION_RESPONSE')
              .then(function (response) {
                return hook;
              }).catch(function (err) {
                // Don't throw error just because email didn't send
                return hook;
              });
          } else {
            throw new errors.NotAuthenticated('Must be an admin to update reservation status.');
          }          
        }

        if (adminNotes && (reservation.adminNotes !== adminNotes)) {
          if (user.isAdmin(hook.params.user)) {
            return email.sendEmail(hook.app, reservation.user.email, null, 'added notes to', 'USER_RESERVATION_RESPONSE')
              .then(function (response) {
                return hook;
              }).catch(function (err) {
                // Don't throw error just because email didn't send
                return hook;
              });
          } else {
            throw new errors.NotAuthenticated('Must be an admin to update reservation admin notes.');
          }
        }

        if (disabled && !reservation.disabled) {
          if (user.isAdmin(hook.params.user)) {
            hook.data.disabledById = hook.params.user.id;

            return email.sendEmail(hook.app, reservation.user.email, null, 'rejected', 'USER_RESERVATION_RESPONSE')
              .then(function (response) {
                return hook;
              }).catch(function (err) {
                // Don't throw error just because email didn't send
                return hook;
              });
          } else {
            throw new errors.NotAuthenticated('Must be an admin to update reservation status.');
          }
        }

        return hook;
      }).catch(function (err) {
        throw err;
      });
    } else {
      return hook;
    }
  };
};
