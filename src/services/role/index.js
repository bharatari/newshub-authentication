'use strict';

const service = require('feathers-sequelize');
const role = require('./role-model');
const hooks = require('./hooks');

module.exports = function () {
  const app = this;

  const options = {
    Model: role(app.get('sequelize')),
  };

  // Initialize our service with any options it requires
  app.use('/api/role', service(options));

  // Get our initialize service to that we can bind hooks
  const roleService = app.service('/api/role');

  // Set up our before hooks
  roleService.before(hooks.before);

  // Set up our after hooks
  roleService.after(hooks.after);
};
