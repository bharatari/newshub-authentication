'use strict';

const user = require('../../user/utils');
const errors = require('feathers-errors');
const email = require('../../../utils/email');
const _ = require('lodash');
const roles = require('../../../utils/roles');

module.exports = function (options) {
  return function (hook) {
    const models = hook.app.get('sequelize').models;
    const redis = hook.app.get('redis');
    const { approved, adminNotes, disabled, specialRequests } = hook.data;

    if (approved || adminNotes || disabled) {
      return models.roomReservation.findOne({
        where: {
          id: hook.id,
        },
        include: [{
          model: models.user,
        }],
      }).then(function (reservation) {
        if (approved && !reservation.approved) {
          if (_.isNil(specialRequests) && _.isNil(reservation.specialRequests)) {
            if (roles.can(models, redis, hook.params.user.id, 'roomReservation', 'update', 'approved')) {
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
            if (roles.has(models, redis, hook.params.user.id, 'roomReservation:special-requests')) {
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

        if (adminNotes && (reservation.adminNotes !== adminNotes)) {
          if (roles.can(models, redis, hook.params.user.id, 'roomReservation', 'update', 'adminNotes')) {
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
          if (roles.can(models, redis, hook.params.user.id, 'roomReservation', 'update', 'disabled')) {
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
