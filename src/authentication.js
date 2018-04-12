const authentication = require('@feathersjs/authentication');
const jwt = require('@feathersjs/authentication-jwt');
const local = require('@feathersjs/authentication-local');
const hooks = require('./hooks/authentication');

module.exports = function (app) {
  const config = {
    ...app.get('auth'),
    strategies: [
      'jwt',
      'local',
    ],
    path: '/api/login',
    entity: 'user',
    service: '/api/user',
    jwt: {
      header: {
        typ: 'access'
      },
      audience: "http://newshub.sitrea.com",
      subject: 'anonymous',
      issuer: 'feathers',
      algorithm: 'HS256',
      expiresIn: '7d',
    },
    local: {
      entity: 'user',
      usernameField: 'username',
      passwordField: 'password',
      service: '/api/user',
    },
  };

  // Set up authentication with the secret
  app.configure(authentication(config));
  app.configure(jwt());
  app.configure(local());

  // The `authentication` service is used to create a JWT.
  // The before `create` hook registers strategies that can be used
  // to create a new valid JWT (e.g. local or oauth2)
  app.service('/api/login').hooks({
    before: {
      create: [
        hooks.normalize(),
        hooks.disabled(),
        authentication.hooks.authenticate(config.strategies),
      ],
      remove: [
        authentication.hooks.authenticate('jwt'),
      ],
    },
  });
};
