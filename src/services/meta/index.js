'use strict';

/* eslint class-methods-use-this: 0 */

const hooks = require('./hooks');

class Service {
  constructor(options) {
    this.options = options || {};
  }

  find(params) {
    return Promise.resolve([]);
  }

  get(id, params) {
    return Promise.resolve({
      id, text: `A new message with ID: ${id}!`,
    });
  }

  setup(app, path) {

  }
}

module.exports = function () {
  const app = this;

  // Initialize our service with any options it requires
  app.use('/api/meta', new Service());

  // Get our initialize service to that we can bind hooks
  const metaService = app.service('/api/meta');

  // Set up our before hooks
  metaService.before(hooks.before);

  // Set up our after hooks
  metaService.after(hooks.after);
};

module.exports.Service = Service;
