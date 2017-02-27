'use strict';

module.exports = {
  available(models, roomId, startDate, endDate) {
    const overlaps = this.overlaps(startDate, endDate);
    const where = Object.assign(overlaps, {
      roomId,
      disabled: false,
    });

    return models.roomReservation.findAll({
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
  overlaps(startDate, endDate) {
    return {
      $or: [{
        // Contains
        startDate: {
          $gte: new Date(startDate),
        },
        endDate: {
          $lte: new Date(endDate),
        },
      }, {
        // Overlaps (Greater)
        startDate: {
          $gte: new Date(startDate),
          $lte: new Date(endDate),
        },
        endDate: {
          $gte: new Date(endDate),
        },
      }, {
        // Overlaps (Less)
        startDate: {
          $lte: new Date(startDate),
        },
        endDate: {
          $lte: new Date(endDate),
          $gte: new Date(startDate),
        },
      }, {
        // Contains (Inverse)
        startDate: {
          $lte: new Date(startDate),
        },
        endDate: {
          $gte: new Date(endDate),
        },
      }],
    };
  },
};
