'use strict';

const errors = require('feathers-errors');
const user = require('../../user/utils');
const roles = require('../../../utils/roles');

module.exports = function (options) {
  return function (hook) {
    const models = hook.app.get('sequelize').models;
    const redis = hook.app.get('redis');

    return models.reservation.findOne({
      where: {
        id: hook.id,
      },
    }).then((reservation) => {
      if (reservation.dataValues.approved) {
        if (roles.can(models, redis, hook.params.user.id, 'reservation', 'delete')) {
          return hook;
        } else {
          throw new errors.BadRequest('You cannot delete a reservation after it has been approved');
        }
      } else if (roles.can(models, redis, hook.params.user.id, 'reservation', 'delete')) {
        return hook;
      } else if (hook.reservation.userId === hook.params.user.id) {
        return hook;
      } else {
        throw new errors.NotAuthenticated('Must be an admin or owner to delete this');
      }
    }).catch((err) => {
      throw err;
    });
  };
};

