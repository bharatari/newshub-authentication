'use strict';

const service = require('feathers-sequelize');
const activity = require('./activity-model');
const hooks = require('./hooks');

module.exports = function () {
  const app = this;

  const options = {
    Model: activity(app.get('sequelize')),
    paginate: {
      default: 5,
      max: 25
    }
  };

  // Initialize our service with any options it requires
  app.use('/api/activity', service(options));

  // Get our initialize service to that we can bind hooks
  const activityService = app.service('/api/activity');

  // Set up our before hooks
  activityService.before(hooks.before);

  // Set up our after hooks
  activityService.after(hooks.after);
};
