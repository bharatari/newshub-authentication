'use strict';

const user = require('../../user/utils');
const errors = require('feathers-errors');

module.exports = function (options) {
  return function (hook) {
    const models = hook.app.get('sequelize').models;
    const { approved, checkedOut, checkedIn } = hook.data;

    if (approved || checkedOut || checkedIn) {
      return models.reservation.findOne({
        where: {
          id: hook.id,
        },
      }).then(function (reservation) {
        if (approved && !reservation.approved) {
          if (user.isAdmin(hook.params.user)) {
            hook.data.approvedById = hook.params.user.id;
          } else {
            throw new errors.NotAuthenticated('Must be an admin to update reservation status.');
          }          
        }

        if (checkedOut && !reservation.checkedOut) {
          if (user.isAdmin(hook.params.user)) {
            hook.data.checkedOutById = hook.params.user.id;
          } else {
            throw new errors.NotAuthenticated('Must be an admin to update reservation status.');
          }
        }

        if (checkedIn && !reservation.checkedIn) {
          if (user.isAdmin(hook.params.user)) {
            hook.data.checkedInById = hook.params.user.id;
          } else {
            throw new errors.NotAuthenticated('Must be an admin to update reservation status.');
          }          
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
