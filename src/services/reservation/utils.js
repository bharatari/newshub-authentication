'use strict';

const errors = require('@feathersjs/errors');
const email = require('../../utils/email');
const _ = require('lodash');
const access = require('../../utils/access');
const async = require('async');

module.exports = {
  async checkSpecialApproval(models, id) {
    return models.reservation.findOne({
      where: {
        id,
      },
      include: [{
        model: models.device,
      }],
    }).then((reservation) => {
      for (let i = 0; i < reservation.devices.length; i++) {
        if (reservation.devices[i].specialApproval) {
          return reservation.devices[i].specialApproval;
        }
      }

      return false;
    }).catch((err) => {
      throw new errors.GeneralError();
    });
  },

  /**
   * Handles reservation approval.
   * 
   * @param {Object} hook - Feathers request hook
   * @param models
   * @param redis
   * @param {string} userId
   * @param {Object} reservation - Old record from database
   * @param {Object} data - New data from request
   */
  async approve(hook, models, redis, userId, reservation, data) {
    if (_.isNil(data.specialRequests) && _.isNil(reservation.specialRequests)) {
      const specialApproval = await this.checkSpecialApproval(models, reservation.id);

      if (specialApproval) {
        const canApproveSpecialApproval = await access.has(models, redis, userId, specialApproval);

        if (canApproveSpecialApproval) {
          hook.data.approvedById = userId;

          try {
            await email.queueEmails([reservation.user], null, 'approved', 'USER_RESERVATION_RESPONSE');

            return hook;
          } catch (e) {
            // Don't throw error just because email didn't send
            return hook;
          }
        } else {
          throw new errors.NotAuthenticated('MASTER_SPECIAL_REQUEST');
        }
      } else {
        const canApprove = await access.can(models, redis, userId, 'reservation', 'update', 'approved', hook.id);

        if (canApprove) {
          hook.data.approvedById = userId;

          try {
            await email.queueEmails([reservation.user], null, 'approved', 'USER_RESERVATION_RESPONSE');

            return hook;
          } catch (e) {
            // Don't throw error just because email didn't send
            return hook;
          }
        } else {
          throw new errors.NotAuthenticated('Must have permission to update reservation status.');
        }
      }
    } else {
      const canApproveSpecialRequests = await access.has(models, redis, userId, 'reservation:special-requests');

      if (canApproveSpecialRequests) {
        hook.data.approvedById = userId;

        try {
          await email.queueEmails([reservation.user], null, 'approved', 'USER_RESERVATION_RESPONSE');

          return hook;
        } catch (e) {
          // Don't throw error just because email didn't send
          return hook;
        }
      } else {
        throw new errors.NotAuthenticated('MASTER_SPECIAL_REQUEST');
      }
    }
  },
  async checkOut(hook, models, redis, userId, reservation, data) {
    const canCheckOut = await access.can(models, redis, userId, 'reservation', 'update', 'checkedOut', hook.id);

    if (canCheckOut) {
      hook.data.checkedOutById = userId;

      try {
        await email.queueEmails([reservation.user], null, 'checked out', 'USER_RESERVATION_RESPONSE')

        return hook;
      } catch (e) {
        // Don't throw error just because email didn't send
        return hook;
      }
    } else {
      throw new errors.NotAuthenticated('Must have permission to update reservation status.');
    }
  },
  async checkIn(hook, models, redis, userId, reservation, data) {
    const canCheckIn = await access.can(models, redis, userId, 'reservation', 'update', 'checkedIn', hook.id);

    if (canCheckIn) {
      hook.data.checkedInById = userId;

      try {
        await email.queueEmails([reservation.user], null, 'checked in', 'USER_RESERVATION_RESPONSE')

        return hook;
      } catch (e) {
        // Don't throw error just because email didn't send
        return hook;
      }
    } else {
      throw new errors.NotAuthenticated('Must have permission to update reservation status.');
    }
  },
  async disable(hook, models, redis, userId, reservation, data) {
    const canDisable = await access.can(models, redis, userId, 'reservation', 'update', 'disabled', hook.id);

    if (canDisable) {
      hook.data.disabledById = userId;

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
  },
  async adminNotes(hook, models, redis, userId, reservation, data) {
    const canUpdateAdminNotes = await access.can(models, redis, userId, 'reservation', 'update', 'adminNotes', hook.id);

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
  },
  overlaps(startDate, endDate) {
    return {
      $or: [{
        // Contains
        startDate: {
          $gte: new Date(startDate),
        },
        endDate: {
          $lte: new Date(endDate),
        },
      }, {
        // Overlaps (Greater)
        startDate: {
          $gte: new Date(startDate),
          $lte: new Date(endDate),
        },
        endDate: {
          $gte: new Date(endDate),
        },
      }, {
        // Overlaps (Less)
        startDate: {
          $lte: new Date(startDate),
        },
        endDate: {
          $lte: new Date(endDate),
          $gte: new Date(startDate),
        },
      }, {
        // Contains (Inverse)
        startDate: {
          $lte: new Date(startDate),
        },
        endDate: {
          $gte: new Date(endDate),
        },
      }],
    };
  },
};
