'use strict';

const errors = require('feathers-errors');
const user = require('../../user/utils');

module.exports = function (options) {
  return function (hook) {
    const models = hook.app.get('sequelize').models;

    return models.reservation.findOne({
      where: {
        id: hook.id,
      },
    }).then((reservation) => {
      if (reservation.dataValues.approved) {
        if (user.isAdmin(hook.params.user)) {
          return hook;
        }

        throw new errors.BadRequest('You cannot delete a reservation after it has been approved');
      } else if (user.isAdmin(hook.params.user)) {
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

