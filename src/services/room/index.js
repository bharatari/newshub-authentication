'use strict';

const service = require('feathers-sequelize');
const room = require('./room-model');
const hooks = require('./hooks');

module.exports = function(){
  const app = this;

  const options = {
    Model: room(app.get('sequelize')),
    paginate: {
      default: 5,
      max: 25
    }
  };

  // Initialize our service with any options it requires
  app.use('/api/room', service(options));

  // Get our initialize service to that we can bind hooks
  const roomService = app.service('/api/room');

  // Set up our before hooks
  roomService.before(hooks.before);

  // Set up our after hooks
  roomService.after(hooks.after);
};
