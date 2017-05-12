'use strict';

const async = require('async');
const email = require('../../../utils/email');
const access = require('../../../utils/access');

module.exports = function (options) {
  return async function (hook) {
    const models = hook.app.get('sequelize').models;
    const redis = hook.app.get('redis');

    const hasAutoApprove = await access.has(models, redis, hook.params.user.id, 'roomReservation:auto-approve');

    if (hasAutoApprove) {
      return hook;
    } else {
      return hook.app.get('sequelize').models.user.findAll({
        where: {
          $or: [
            {
              roles: 'master',
            },
          ],
          options: {
            $or: [
              {
                doNotDisturb: null,
              },
              {
                doNotDisturb: {
                  $not: true,
                },
              },
            ],
          },
        },
      }).then(users => new Promise((resolve, reject) => {
        async.each(users, (user, callback) => {
          email.sendEmail(hook.app, user.dataValues.email, null, hook.params.user.fullName, 'CREATED_ROOM_RESERVATION')
              .then((response) => {
                callback();
              }).catch((err) => {
                // Don't throw error just because email didn't send
                callback();
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
  };
};
