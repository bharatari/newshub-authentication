'use strict';

const service = require('feathers-sequelize');
const device = require('./device-model');
const hooks = require('./hooks');

module.exports = function () {
  const app = this;

  const options = {
    Model: device(app.get('sequelize')),
    raw: false,
  };

  // Initialize our service with any options it requires
  app.use('/api/device', service(options));

  // Get our initialize service to that we can bind hooks
  const deviceService = app.service('/api/device');

  deviceService.hooks(hooks);
};
