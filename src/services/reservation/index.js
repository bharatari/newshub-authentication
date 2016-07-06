'use strict';

const service = require('feathers-sequelize');
const reservation = require('./reservation-model');
const hooks = require('./hooks');

module.exports = function(){
  const app = this;

  const options = {
    Model: reservation(app.get('sequelize')),
    paginate: {
      default: 5,
      max: 25
    }
  };

  // Initialize our service with any options it requires
  app.use('/api/reservation', service(options));

  // Get our initialize service to that we can bind hooks
  const reservationService = app.service('/api/reservation');

  // Set up our before hooks
  reservationService.before(hooks.before);

  // Set up our after hooks
  reservationService.after(hooks.after);
};
