'use strict';

const async = require('async');
const _ = require('lodash');

module.exports = {
  processQuantity(models, devices, startDate, endDate) {
    return models.reservation.findAll({
      where: {
        date: {
          $overlap: [new Date(startDate), new Date(endDate)],
        },
      },
      include: [{
        model: models.device
      }],
    }).then((reservations) => {
      return new Promise((resolve, reject) => {
        async.each(reservations, (reservation, callback) => {
          async.each(reservation.devices, (device, cb) => {
            this.subtractQuantity(devices, device.id, quantity);
            cb();
          }, function (err) {
            callback();
          });
        }, function (err) {
          if (err) {
            reject(err);
          } else {
            resolve(devices);
          }
        });
      });
    }).catch(function (err) {
      throw err;
    });
  },
  subtractQuantity(devices, id, quantity) {
    let device = _.find(devices, function (item) {
      return item.dataValues.id === id;
    });

    device.dataValues.availableQuantity = device.dataValues.availableQuantity - quantity;

    return devices;
  },
};
