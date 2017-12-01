'use strict';

const authentication = require('@feathersjs/authentication');
const jwt = require('feathers-authentication-jwt');
const local = require('feathers-authentication-local');
const hooks = require('./hooks');

module.exports = function () {
  const app = this;

  const auth = app.get('auth');

  const config = {
    path: '/api/login',
    entity: 'user',
    service: '/api/user',
    local: {
      usernameField: 'username',
      service: '/api/user',
    },
  };

  Object.assign(config, auth);

  app.configure(authentication(config))
     .configure(jwt())
     .configure(local());

  // Get our initialize service to that we can bind hooks
  const service = app.service('/api/login');

  // Set up our before hooks
  service.before(hooks.before);

  // Set up our after hooks
  service.after(hooks.after);
};
