'use strict';

const service = require('feathers-sequelize');
const resetPasswordToken = require('./resetPasswordToken-model');
const hooks = require('./hooks');

module.exports = function(){
  const app = this;

  const options = {
    Model: resetPasswordToken(app.get('sequelize')),
    paginate: {
      default: 5,
      max: 25
    }
  };

  // Initialize our service with any options it requires
  app.use('/api/reset-password', service(options));

  // Get our initialize service to that we can bind hooks
  const resetPasswordService = app.service('/api/reset-password');

  // Set up our before hooks
  resetPasswordService.before(hooks.before);

  // Set up our after hooks
  resetPasswordService.after(hooks.after);
};
