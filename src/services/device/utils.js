'use strict';

const async = require('async');
const _ = require('lodash');
const reservation = require('../reservation/utils');

module.exports = {
  processQuantity(models, devices, startDate, endDate) {
    return models.reservation.findAll({
      where: reservation.overlaps(startDate, endDate),
      include: [{
        model: models.device,
      }],
    }).then(reservations => new Promise((resolve, reject) => {
      async.each(reservations, (reservation, callback) => {
        async.each(reservation.devices, (device, cb) => {
          devices = this.subtractQuantity(devices, device.id, device.reservation_devices.quantity);
          cb();
        }, (err) => {
          callback();
        });
      }, (err) => {
        if (err) {
          reject(err);
        } else {
          resolve(devices);
        }
      });
    })).catch((err) => {
      throw err;
    });
  },
  subtractQuantity(devices, id, quantity) {
    const device = _.find(devices, item => item.dataValues.id === id);

    device.dataValues.availableQuantity = device.dataValues.availableQuantity - quantity;

    if (device.dataValues.availableQuantity < 0) {
      device.dataValues.availableQuantity = 0;
    }

    return devices;
  },
};
