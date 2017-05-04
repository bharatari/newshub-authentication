'use strict';

const errors = require('feathers-errors');
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
          return true;
        }
      }

      return false;
    }).catch((err) => {
      console.log(err);
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
        const canApproveSpecialApproval = await access.has(models, redis, userId, 'reservation:special-approval');

        if (canApproveSpecialApproval) {
          hook.data.approvedById = userId;

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
      } else {
        const canApprove = await access.can(models, redis, userId, 'reservation', 'update', 'approved')

        if (canApprove) {
          hook.data.approvedById = userId;

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
      }
    } else {
      const canApproveSpecialRequests = await access.has(models, redis, userId, 'reservation:special-requests');

      if (canApproveSpecialRequests) {
        hook.data.approvedById = userId;

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
  },
  async checkOut(hook, models, redis, userId, reservation, data) {
    const canCheckOut = await access.can(models, redis, userId, 'reservation', 'update', 'checkedOut');

    if (canCheckOut) {
      hook.data.checkedOutById = userId;

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
  },
  async checkIn(hook, models, redis, userId, reservation, data) {
    const canCheckIn = await access.can(models, redis, userId, 'reservation', 'update', 'checkedIn');

    if (canCheckIn) {
      hook.data.checkedInById = userId;

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
  },
  async disable(hook, models, redis, userId, reservation, data) {
    const canDisable = await access.can(models, redis, userId, 'reservation', 'update', 'disabled');

    if (canDisable) {
      hook.data.disabledById = userId;

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
  },
  async adminNotes(hook, models, redis, userId, reservation, data) {
    const canUpdateAdminNotes = await access.can(models, redis, userId, 'reservation', 'update', 'adminNotes');

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
