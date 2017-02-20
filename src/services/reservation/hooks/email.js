'use strict';

const async = require('async');
const email = require('../../../utils/email');

module.exports = function (options) {
  return function (hook) {
    // This is an example of how explictly including roles
    // in code is fine. In this case we're not talking about
    // hard-coding a permission, but treating certain groups
    // of users a certain way. In this case that means notifying
    // all non-standard users of new reservations.

    // This is generally quite inefficient but it's only like that
    // because of the unique circumstances of the application. In a larger
    // application you would never send emails to every single person with a given
    // role, you would probably have a specific filter such as a group ID or a project
    // ID and then filter further based on roles. In this case, the entire app
    // represents a specific group so doing things this way should be fine.
    return hook.app.get('sequelize').models.user.findAll({
      where: {
        $or: [
          {
            roles: 'admin',
          },
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
        email.sendEmail(hook.app, user.dataValues.email, null, hook.params.user.fullName, 'CREATED_RESERVATION')
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
  };
};
