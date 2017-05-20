'use strict';

const errors = require('feathers-errors');
const email = require('../../../utils/email');
const _ = require('lodash');
const access = require('../../../utils/access');

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
      }).then(async function (reservation) {
        if (approved && !reservation.approved) {
          if (_.isNil(specialRequests) && _.isNil(reservation.specialRequests)) {
            const canApprove = await access.can(models, redis, hook.params.user.id, 'roomReservation', 'update', 'approved');
            
            if (canApprove) {
              hook.data.approvedById = hook.params.user.id;

              try {
                await email.queueEmails([reservation.user], null, 'approved', 'USER_RESERVATION_RESPONSE')

                return hook;
              } catch (e) {
                // Don't throw error just because email didn't send
                return hook;
              }
            } else {
              throw new errors.NotAuthenticated('Must have permission to update reservation status.');
            }
          } else {
            const hasSpecialRequests = await access.has(models, redis, hook.params.user.id, 'roomReservation:special-requests');

            if (hasSpecialRequests) {
              hook.data.approvedById = hook.params.user.id;

              try {
                await email.queueEmails([reservation.user], null, 'approved', 'USER_RESERVATION_RESPONSE')

                return hook;
              } catch (e) {
                // Don't throw error just because email didn't send
                return hook;
              }
            } else {
              throw new errors.NotAuthenticated('MASTER_SPECIAL_REQUEST');
            }
          }
        }

        if (adminNotes && (reservation.adminNotes !== adminNotes)) {
          const canUpdateAdminNotes = await access.can(models, redis, hook.params.user.id, 'roomReservation', 'update', 'adminNotes');

          if (canUpdateAdminNotes) {
            try {
              await email.queueEmails([reservation.user], null, adminNotes, 'USER_RESERVATION_ADMIN_NOTES')

              return hook;
            } catch (e) {
              // Don't throw error just because email didn't send
              return hook;
            }
          } else {
            throw new errors.NotAuthenticated('Must have permission to update reservation admin notes.');
          }
        }

        if (disabled && !reservation.disabled) {
          const canUpdateDisabled = await access.can(models, redis, hook.params.user.id, 'roomReservation', 'update', 'disabled');

          if (canUpdateDisabled) {
            hook.data.disabledById = hook.params.user.id;

            try {
              await email.queueEmails([reservation.user], null, 'rejected', 'USER_RESERVATION_RESPONSE')

              return hook;
            } catch (e) {
              // Don't throw error just because email didn't send
              return hook;
            }
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
