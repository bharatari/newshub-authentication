'use strict';

const utils = require('../utils');
const errors = require('feathers-errors');

module.exports = function () {
  return function (hook) {
    const models = hook.app.get('sequelize').models;
    const { startDate, endDate, roomId } = hook.data;

    return utils.available(models, roomId, startDate, endDate)
      .then((result) => {
        if (result) {
          return hook;
        }

        throw new errors.BadRequest('Room unavailable for given dates');
      })
      .catch((err) => {
        throw err;
      });
  };
};
