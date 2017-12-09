'use strict';

const service = require('feathers-sequelize');
const signupToken = require('./signupToken-model');
const hooks = require('./hooks');

module.exports = function () {
  const app = this;

  const options = {
    Model: signupToken(app.get('sequelize')),
    paginate: {
      default: 5,
      max: 25,
    },
    raw: false,
  };

  // Initialize our service with any options it requires
  app.use('/api/signup-token', service(options));

  // Get our initialize service to that we can bind hooks
  const signupTokenService = app.service('/api/signup-token');

  signupTokenService.hooks(hooks);
};
