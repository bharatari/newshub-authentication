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
          await utils.approve(hook, models, redis, hook.params.user.id, reservation, hook.data);
        }

        if (adminNotes && (reservation.adminNotes !== adminNotes)) {
          await utils.adminNotes(hook, models, redis, hook.params.user.id, reservation, hook.data);
        }

        if (disabled && !reservation.disabled) {
          await utils.disable(hook, models, redis, hook.params.user.id, reservation, hook.data);
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
