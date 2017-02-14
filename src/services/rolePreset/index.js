'use strict';

const service = require('feathers-sequelize');
const rolePreset = require('./rolePreset-model');
const hooks = require('./hooks');

module.exports = function () {
  const app = this;

  const options = {
    Model: rolePreset(app.get('sequelize')),
    paginate: {
      default: 5,
      max: 25,
    },
  };

  // Initialize our service with any options it requires
  app.use('/api/role-preset', service(options));

  // Get our initialize service to that we can bind hooks
  const rolePresetService = app.service('/api/role-preset');

  // Set up our before hooks
  rolePresetService.before(hooks.before);

  // Set up our after hooks
  rolePresetService.after(hooks.after);
};
