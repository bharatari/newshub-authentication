'use strict';

const async = require('async');
const email = require('../../../utils/email');

module.exports = function (options) {
  return function (hook) {
    return hook.app.get('sequelize').models.user.findAll({
      where: {
        $or: [
          {
            roles: 'admin',
          },
          {
            roles: 'master',
          }
        ],
      },  
    }).then(function (users) {
      return new Promise((resolve, reject) => {
        async.each(users, function (user, callback) {
          email.sendEmail(hook.app, user.dataValues.email, null, hook.params.user.fullName, 'CREATED_RESERVATION')
            .then(function (response) {
              callback();
            }).catch(function (err) {
              // Don't throw error just because email didn't send
              callback();
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
  };
};
