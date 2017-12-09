'use strict';

const service = require('feathers-sequelize');
const reservation = require('./reservation-model');
const hooks = require('./hooks');

module.exports = function () {
  const app = this;

  const options = {
    Model: reservation(app.get('sequelize')),
    paginate: {
      default: 5,
      max: 25,
    },
    raw: false,
  };

  // Initialize our service with any options it requires
  app.use('/api/reservation', service(options));

  // Get our initialize service to that we can bind hooks
  const reservationService = app.service('/api/reservation');

  reservationService.hooks(hooks);
};
