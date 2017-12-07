'use strict';

const service = require('feathers-sequelize');
const roomReservation = require('./roomReservation-model');
const hooks = require('./hooks');

module.exports = function(){
  const app = this;

  const options = {
    Model: roomReservation(app.get('sequelize')),
    paginate: {
      default: 5,
      max: 25
    },
    raw: false,
  };

  // Initialize our service with any options it requires
  app.use('/api/room-reservation', service(options));

  // Get our initialize service to that we can bind hooks
  const roomReservationService = app.service('/api/room-reservation');

  roomReservationService.hooks(hooks);
};
