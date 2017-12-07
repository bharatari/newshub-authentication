'use strict';

const async = require('async');

module.exports = function (options) {
  return function (hook) {
    if (hook.method === 'create') {
      if (hook.params.devices) {
        return hook.app.get('sequelize').models.reservation.findOne({
          where: {
            id: hook.result.id,
          },
        }).then(reservation => new Promise((resolve, reject) => {
          async.each(hook.params.devices, (device, callback) => {
            reservation.addDevice(device.id, {
              quantity: device.reservedQuantity,
            }).then((reservation) => {
              callback();
            }).catch((err) => {
              callback(err);
            });
          }, (err) => {
            if (err) {
              reject(err);
            } else {
              resolve();
            }
          });
        }));
      }
    }

    return hook;
  };
};

