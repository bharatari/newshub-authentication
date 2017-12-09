'use strict';

const errors = require('@feathersjs/errors');
const email = require('../../../utils/email');
const _ = require('lodash');
const access = require('../../../utils/access');
const utils = require('../utils');

module.exports = function (options) {
  return function (hook) {
    const models = hook.app.get('sequelize').models;
    const redis = hook.app.get('redis');
    const { 
      approved,
      checkedOut,
      checkedIn,
      adminNotes,
      disabled,
      specialRequests,
      approvedById,
      checkedOutById,
      checkedInById
    } = hook.data;

    if (approved || checkedOut || checkedIn || adminNotes || disabled) {
      return models.reservation.findOne({
        where: {
          id: hook.id,
        },
        include: [{
          model: models.user,
        }],
      }).then(async function (reservation) {
        if (approvedById && (reservation.approvedById !== approvedById)) {
          throw new errors.BadRequest('CANNOT_UPDATE_ID_FIELDS');
        }

        if (checkedOutById && (reservation.checkedOutById !== checkedOutById)) {
          throw new errors.BadRequest('CANNOT_UPDATE_ID_FIELDS');
        }

        if (checkedInById && (reservation.checkedInById !== checkedInById)) {
          throw new errors.BadRequest('CANNOT_UPDATE_ID_FIELDS');
        }

        if (approved && !reservation.approved) {
          hook = await utils.approve(hook, models, redis, hook.params.user.id, reservation, hook.data);
        }

        if (checkedOut && !reservation.checkedOut) {
          hook = await utils.checkOut(hook, models, redis, hook.params.user.id, reservation, hook.data);
        }

        if (checkedIn && !reservation.checkedIn) {
          hook = await utils.checkIn(hook, models, redis, hook.params.user.id, reservation, hook.data);
        }

        if (adminNotes && (reservation.adminNotes !== adminNotes)) {
          hook = await utils.adminNotes(hook, models, redis, hook.params.user.id, reservation, hook.data);
        }

        if (disabled && !reservation.disabled) {
          hook = await utils.disable(hook, models, redis, hook.params.user.id, reservation, hook.data);
        }

        if ((approved === false) && reservation.approved) {
          throw new errors.BadRequest('STATUS_ROLLBACK');
        }
        
        if ((checkedOut === false) && reservation.checkedOut) {
          throw new errors.BadRequest('STATUS_ROLLBACK');
        }

        if ((checkedIn === false) && reservation.checkedIn) {
          throw new errors.BadRequest('STATUS_ROLLBACK');
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
