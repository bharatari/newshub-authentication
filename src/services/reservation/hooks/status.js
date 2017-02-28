'use strict';

const errors = require('feathers-errors');
const email = require('../../../utils/email');
const _ = require('lodash');
const access = require('../../../utils/access');

module.exports = function (options) {
  return function (hook) {
    const models = hook.app.get('sequelize').models;
    const redis = hook.app.get('redis');
    const { approved, checkedOut, checkedIn, adminNotes, disabled, specialRequests } = hook.data;

    if (approved || checkedOut || checkedIn || adminNotes || disabled) {
      return models.reservation.findOne({
        where: {
          id: hook.id,
        },
        include: [{
          model: models.user,
        }],
      }).then(async function (reservation) {
        if (approved && !reservation.approved) {
          if (_.isNil(specialRequests) && _.isNil(reservation.specialRequests)) {
            const canApprove = await access.can(models, redis, hook.params.user.id, 'reservation', 'update', 'approved')

            if (canApprove) {
              hook.data.approvedById = hook.params.user.id;

              return email.sendEmail(hook.app, reservation.user.email, null, 'approved', 'USER_RESERVATION_RESPONSE')
                .then(function (response) {
                  return hook;
                }).catch(function (err) {
                  // Don't throw error just because email didn't send
                  return hook;
                });
            } else {
              throw new errors.NotAuthenticated('Must have permission to update reservation status.');
            }
          } else {
            const canApproveSpecialRequests = await access.has(models, redis, hook.params.user.id, 'reservation:special-requests');

            if (canApproveSpecialRequests) {
              hook.data.approvedById = hook.params.user.id;

              return email.sendEmail(hook.app, reservation.user.email, null, 'approved', 'USER_RESERVATION_RESPONSE')
                .then(function (response) {
                  return hook;
                }).catch(function (err) {
                  // Don't throw error just because email didn't send
                  return hook;
                });
            } else {
              throw new errors.NotAuthenticated('MASTER_SPECIAL_REQUEST');
            }
          }
        }

        if (checkedOut && !reservation.checkedOut) {
          const canCheckOut = await access.can(models, redis, hook.params.user.id, 'reservation', 'update', 'checkedOut');

          if (canCheckOut) {
            hook.data.checkedOutById = hook.params.user.id;

            return email.sendEmail(hook.app, reservation.user.email, null, 'checked out', 'USER_RESERVATION_RESPONSE')
              .then(function (response) {
                return hook;
              }).catch(function (err) {
                // Don't throw error just because email didn't send
                return hook;
              });
          } else {
            throw new errors.NotAuthenticated('Must have permission to update reservation status.');
          }
        }

        if (checkedIn && !reservation.checkedIn) {
          const canCheckIn = await access.can(models, redis, hook.params.user.id, 'reservation', 'update', 'checkedIn');

          if (canCheckIn) {
            hook.data.checkedInById = hook.params.user.id;

            return email.sendEmail(hook.app, reservation.user.email, null, 'checked in', 'USER_RESERVATION_RESPONSE')
              .then(function (response) {
                return hook;
              }).catch(function (err) {
                // Don't throw error just because email didn't send
                return hook;
              });
          } else {
            throw new errors.NotAuthenticated('Must have permission to update reservation status.');
          }          
        }

        if (adminNotes && (reservation.adminNotes !== adminNotes)) {
          const canUpdateAdminNotes = await access.can(models, redis, hook.params.user.id, 'reservation', 'update', 'adminNotes');

          if (canUpdateAdminNotes) {
            return email.sendEmail(hook.app, reservation.user.email, null, adminNotes, 'USER_RESERVATION_ADMIN_NOTES')
              .then(function (response) {
                return hook;
              }).catch(function (err) {
                // Don't throw error just because email didn't send
                return hook;
              });
          } else {
            throw new errors.NotAuthenticated('Must have permission to update reservation admin notes.');
          }
        }

        if (disabled && !reservation.disabled) {
          const canDisable = await access.can(models, redis, hook.params.user.id, 'reservation', 'update', 'disabled');

          if (canDisable) {
            hook.data.disabledById = hook.params.user.id;

            return email.sendEmail(hook.app, reservation.user.email, null, 'rejected', 'USER_RESERVATION_RESPONSE')
              .then(function (response) {
                return hook;
              }).catch(function (err) {
                // Don't throw error just because email didn't send
                return hook;
              });
          } else {
            throw new errors.NotAuthenticated('Must have permission to update reservation status.');
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
