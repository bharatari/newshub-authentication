'use strict';

const email = require('../../../utils/email');
const access = require('../../../utils/access');
const utils = require('../utils');

module.exports = function (options) {
  return async function (hook) {
    const models = hook.app.get('sequelize').models;
    const redis = hook.app.get('redis');

    try {
      const reservation = await models.roomReservation.findOne({
        where: {
          id: hook.result.id,
        },
        include: [{
          model: models.room,
          include: [{   
            model: models.user,
            as: 'manager',
          }]
        }],
      });

      if (reservation.approved) {
        if (hook.data.approved) {
          const event = utils.createEvent(reservation.purpose, reservation.startDate, reservation.endDate);
          
          const attachment = {
            content: event,
            filename: 'reservation.ics'
          };

          await email.queueEmails([ reservation.room.manager.email ], null, hook.params.user.fullName, 'ROOM_MANAGER_NOTIFICATION', [ attachment ]);
        }
      }
    } catch (e) {
      throw e;
    }
  };
};
