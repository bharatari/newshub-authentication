'use strict';

const utils = require('../utils');
const errors = require('@feathersjs/errors');

module.exports = function () {
  return function (hook) {
    const models = hook.app.get('sequelize').models;
    const { startDate, endDate, roomId } = hook.data;

    return utils.available(models, roomId, startDate, endDate)
      .then((result) => {
        if (result) {
          return hook;
        } else {
          throw new errors.BadRequest('ROOM_UNAVAILABLE');
        }        
      })
      .catch((err) => {
        throw err;
      });
  };
};
