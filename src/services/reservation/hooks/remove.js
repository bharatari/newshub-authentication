'use strict';

const errors = require('feathers-errors');
const user = require('../../user/utils');
const access = require('../../../utils/access');

module.exports = function (options) {
  return function (hook) {
    const models = hook.app.get('sequelize').models;
    const redis = hook.app.get('redis');

    return models.reservation.findOne({
      where: {
        id: hook.id,
      },
    }).then(async (reservation) => {
      const canDelete = await access.can(models, redis, hook.params.user.id, 'reservation', 'delete')

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
        throw new errors.NotAuthenticated('Must be an admin or owner to delete this');
      }
    }).catch((err) => {
      throw err;
    });
  };
};

