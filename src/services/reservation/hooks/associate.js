'use strict';

const async = require('async');

module.exports = function (options) {
  return function (hook) {
    if (hook.method === 'create') {
      if (hook.params.devices) {
        return hook.app.get('sequelize').models.reservation.findOne({
          where: {
            id: hook.result.dataValues.id,
          },
        }).then(function (reservation) {
          return new Promise((resolve, reject) => {
            async.each(hook.params.devices, function (device, callback) {
              reservation.addDevice(device.id, { quantity: device.reservedQuantity }).then(function (reservation) {
                callback();
              }).catch(function (err) {
                callback(err);
              });
            }, function (err) {
              if (err) {
                reject(err);
              } else {
                resolve();
              }
            });
          });
        });
      }
    }
    
    return hook;
  };
};

