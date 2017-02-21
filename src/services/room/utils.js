'use strict';

const async = require('async');
const _ = require('lodash');
const reservation = require('../reservation/utils');

module.exports = {
  available(models, roomId, startDate, endDate) {
    const overlaps = reservation.overlaps(startDate, endDate);
    const where = Object.assign(overlaps, {
      roomId,
      disabled: false,
    });

    return models.reservation.findAll({
      where,
      include: [{
        model: models.room,
      }],
    }).then((result) => {
      const reservations = JSON.parse(JSON.stringify(result));

      if (reservations.length > 0) {
        return false;
      }

      return true;
    }).catch((err) => {
      throw err;
    });
  },
};
