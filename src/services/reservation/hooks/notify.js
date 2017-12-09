'use strict';

module.exports = function (options) {
  return async function (hook) {
    const models = hook.app.get('sequelize').models;

    const notification = await models.notification.create({
      title: 'New Reservation',
      body: `${hook.params.user.fullName} created a reservation`,
      activityId: activity.id,
      type: 'info'
    });
  };
};

