'use strict';

const service = require('feathers-sequelize');
const image = require('./image-model');
const hooks = require('./hooks');

module.exports = function () {
  const app = this;

  const options = {
    Model: image(app.get('sequelize')),
    paginate: {
      default: 5,
      max: 25,
    },
  };

  // Initialize our service with any options it requires
  app.use('/api/image', (req, res, next) => {
    req.feathers.file = req.file;
    next();
  }, service(options));

  // Get our initialize service to that we can bind hooks
  const imageService = app.service('/api/image');

  // Set up our before hooks
  imageService.before(hooks.before);

  // Set up our after hooks
  imageService.after(hooks.after);
};
