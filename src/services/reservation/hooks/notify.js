'use strict';

module.exports = function (options) {
  return async function (hook) {
    const models = hook.app.get('sequelize').models;
    
    const activity = await models.activity.create({
      result: hook.result,
      service: 'reservation',
      method: hook.method,
      userId: hook.params.user.id,
      organizationId: hook.params.user.currentOrganizationId,
    });

    const notification = await models.notification.create({
      title: 'New Reservation',
      body: `${hook.params.user.fullName} created a reservation`,
      activityId: activity.id,
      type: 'info'
    });
  };
};

