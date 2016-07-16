'use strict';

const authentication = require('feathers-authentication');

module.exports = function() {
  const app = this;

  const auth = app.get('auth');

  let config = {
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
};
