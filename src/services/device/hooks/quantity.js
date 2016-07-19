'use strict';

const async = require('async');
const utils = require('../utils');

module.exports = function () {
  return function (hook) {
    const models = hook.app.get('sequelize').models;

    if (hook.type === 'before') {
      hook.data = {
        startDate: hook.params.query.startDate,
        endDate: hook.params.query.endDate,
      };

      delete hook.params.query.startDate;
      delete hook.params.query.endDate;
    } else {
      return new Promise((resolve, reject) => {
        const devices = hook.result;

        async.each(devices, (device, callback) => {
          device.dataValues.availableQuantity = device.dataValues.quantity;
          callback();
        }, (err) => {
          if (hook.data.startDate && hook.data.endDate) {
            const startDate = hook.data.startDate;
            const endDate = hook.data.endDate;

            return utils.processQuantity(models, devices, startDate, endDate).then(function (result) {
              resolve(hook);
            }).catch(function (e) {
              reject(e);
            });        
          } else {
            resolve(hook);
          }
        });
      });
    }
  };
};
