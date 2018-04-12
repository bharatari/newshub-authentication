'use strict';

const errors = require('@feathersjs/errors');
const access = require('../../../utils/access');

module.exports = function (options) {
  return function (hook) {
    const models = hook.app.get('sequelize').models;
    const redis = hook.app.get('redis');

    return models.roomReservation.findOne({
      where: {
        id: hook.id,
      },
    }).then(async (reservation) => {
      const canDelete = await access.can(models, redis, hook.params.user.id, 'roomReservation', 'delete', hook.id);

      if (reservation.dataValues.approved) {
        if (canDelete) {
          return hook;
        } else {
          throw new errors.BadRequest('You cannot delete a reservation after it has been approved');
        }
      } else if (canDelete) {
        return hook;
      } else if (hook.reservation.userId === hook.params.user.id) {
        return hook;
      } else {
        throw new errors.Forbidden('You do not have permission to delete this');
      }
    }).catch((err) => {
      throw err;
    });
  };
};

