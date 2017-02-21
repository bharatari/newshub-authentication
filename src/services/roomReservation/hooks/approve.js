'use strict';

module.exports = function (options) {
  return function (hook) {
    const models = hook.app.get('sequelize').models;
    const redis = hook.app.get('redis');

    if (roles.has(models, redis, hook.params.user.id, 'roomReservation:auto-approve')) {
      hook.data.approved = true;
    }
  };
};
