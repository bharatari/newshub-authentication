'use strict';

const service = require('feathers-sequelize');
const building = require('./building-model');
const hooks = require('./hooks');

module.exports = function(){
  const app = this;

  const options = {
    Model: building(app.get('sequelize')),
    paginate: {
      default: 5,
      max: 25
    },
    raw: false,
  };

  // Initialize our service with any options it requires
  app.use('/api/building', service(options));

  // Get our initialize service to that we can bind hooks
  const buildingService = app.service('/api/building');

  buildingService.hooks(hooks);
};
