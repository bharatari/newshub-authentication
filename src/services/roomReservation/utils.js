'use strict';

const icalendar = require('icalendar');
const _ = require('lodash');
const errors = require('@feathersjs/errors');
const email = require('../../utils/email');
const access = require('../../utils/access');
const async = require('async');

module.exports = {
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
    if (reservation.approved) {
      throw new errors.BadRequest('RESERVATION_ALREADY_APPROVED');
    }

    if (_.isNil(data.specialRequests) && _.isNil(reservation.specialRequests)) {
      const canApprove = await access.can(models, redis, userId, 'roomReservation', 'update', 'approved', hook.id);

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
        throw new errors.Forbidden('Must have permission to update reservation status.');
      }
    } else {
      const canApproveSpecialRequests = await access.has(models, redis, userId, 'roomReservation:special-requests');

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
        throw new errors.Forbidden('MASTER_SPECIAL_REQUEST');
      }
    }
  },
  async disable(hook, models, redis, userId, reservation, data) {
    const canDisable = await access.can(models, redis, userId, 'roomReservation', 'update', 'disabled', hook.id);

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
      throw new errors.Forbidden('Must have permission to update reservation status.');
    }
  },
  async adminNotes(hook, models, redis, userId, reservation, data) {
    const canUpdateAdminNotes = await access.can(models, redis, userId, 'roomReservation', 'update', 'adminNotes', hook.id);

    if (canUpdateAdminNotes) {
      try {
        await email.queueEmails([reservation.user], null, adminNotes, 'USER_RESERVATION_ADMIN_NOTES')

        return hook;
      } catch (e) {
        // Don't throw error just because email didn't send
        return hook;
      }
    } else {
      throw new errors.Forbidden('Must have permission to update reservation admin notes.');
    }
  },
  available(models, roomId, startDate, endDate) {
    const overlaps = this.overlaps(startDate, endDate);
    const where = Object.assign(overlaps, {
      roomId,
      disabled: false,
    });

    return models.roomReservation.findAll({
      where,
      include: [{
        model: models.room,
      }],
    }).then((result) => {
      const reservations = JSON.parse(JSON.stringify(result));

      if (reservations.length > 0) {
        return false;
      }

      return true;
    }).catch((err) => {
      throw err;
    });
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
  createEvent(name, start, end) {
    const event = new icalendar.VEvent();

    event.setSummary(name);
    event.setDate(new Date(start), new Date(end));

    return event.toString();
  },
};
