'use strict';

const service = require('feathers-sequelize');
const device = require('./device-model');
const hooks = require('./hooks');

module.exports = function(){
  const app = this;

  const options = {
    Model: device(app.get('sequelize')),
  };

  // Initialize our service with any options it requires
  app.use('/api/device', service(options));

  // Get our initialize service to that we can bind hooks
  const deviceService = app.service('/api/device');

  // Set up our before hooks
  deviceService.before(hooks.before);

  // Set up our after hooks
  deviceService.after(hooks.after);
};
