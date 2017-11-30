'use strict';

const authentication = require('@feathersjs/authentication');
const hooks = require('./hooks');

module.exports = function () {
  const app = this;

  const auth = app.get('auth');

  const config = {
    userEndpoint: '/api/user',
    localEndpoint: '/api/login',
    successRedirect: false,
    failureRedirect: false,
    shouldSetupSuccessRoute: false,
    shouldSetupFailureRoute: false,
    idField: 'id',
    local: {
      usernameField: 'username',
    },
  };

  Object.assign(config, auth);

  app.configure(authentication(config));

  // Get our initialize service to that we can bind hooks
  const service = app.service('/api/login');

  // Set up our before hooks
  service.before(hooks.before);

  // Set up our after hooks
  service.after(hooks.after);
};
