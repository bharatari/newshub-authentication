'use strict';

const errors = require('feathers-errors');
const user = require('../../user/utils');

module.exports = function (options) {
  return function (hook) {
    const models = hook.app.get('sequelize').models;

    return models.roomReservation.findOne({
      where: {
        id: hook.id,
      },
    }).then((reservation) => {
      if (reservation.dataValues.approved) {
        if (roles.can(models, redis, hook.params.user.id, 'roomReservation', 'delete')) {
          return hook;
        } else {
          throw new errors.BadRequest('You cannot delete a reservation after it has been approved');
        }
      } else if (roles.can(models, redis, hook.params.user.id, 'roomReservation', 'delete')) {
        return hook;
      } else if (hook.reservation.userId === hook.params.user.id) {
        return hook;
      } else {
        throw new errors.NotAuthenticated('You do not have permission to delete this');
      }
    }).catch((err) => {
      throw err;
    });
  };
};

