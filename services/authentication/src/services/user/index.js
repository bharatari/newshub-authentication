'use strict';

const service = require('feathers-sequelize');
const user = require('./user-model');
const hooks = require('./hooks');

module.exports = function () {
  const app = this;

  const options = {
    Model: user(app.get('sequelize')),
    raw: false,
  };

  // Initialize our service with any options it requires
  app.use('/api/user', service(options));

  // Get our initialize service to that we can bind hooks
  const userService = app.service('/api/user');

  userService.hooks(hooks);
};
