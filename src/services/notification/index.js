'use strict';

const service = require('feathers-sequelize');
const notification = require('./notification-model');
const hooks = require('./hooks');

module.exports = function(){
  const app = this;

  const options = {
    Model: notification(app.get('sequelize')),
    paginate: {
      default: 5,
      max: 25
    }
  };

  // Initialize our service with any options it requires
  app.use('/api/notification', service(options));

  // Get our initialize service to that we can bind hooks
  const notificationService = app.service('/api/notification');

  // Set up our before hooks
  notificationService.before(hooks.before);

  // Set up our after hooks
  notificationService.after(hooks.after);
};
