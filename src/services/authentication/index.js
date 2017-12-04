'use strict';

const hooks = require('./hooks');

module.exports = function () {
  const app = this;

  // Get our initialize service to that we can bind hooks
  const service = app.service('/api/login');

  service.hooks(hooks);
};
