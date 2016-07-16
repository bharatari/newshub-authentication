'use strict';

const authentication = require('feathers-authentication');

module.exports = function() {
  const app = this;

  const auth = app.get('auth');

  const config = {
    localEndpoint: '/api/login',
    local: {
      usernameField: 'username',
    },
  };

  Object.assign(config, auth);
  
  app.configure(authentication(config));
};
