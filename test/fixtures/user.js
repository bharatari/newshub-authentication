const bcrypt = require('bcryptjs');

module.exports = function (models) {
  return new Promise((resolve, reject) => models.user.destroy({ where: {} })
      .then(() => {
        bcrypt.genSalt(10, (error, salt) => {
          const password = 'password';

          bcrypt.hash(password, salt, (error, hash) => {
            resolve([
              {
                model: 'user',
                data: {
                  username: 'normal',
                  firstName: 'Normal',
                  lastName: 'User',
                  email: 'normal@domain.com',
                  password: hash,
                  disabled: false,
                  options: {},
                },
              },
              {
                model: 'user',
                data: {
                  username: 'admin',
                  firstName: 'Admin',
                  lastName: 'User',
                  email: 'admin@domain.com',
                  password: hash,
                  disabled: false,
                  options: {},
                  roles: 'admin',
                },
              },
              {
                model: 'user',
                data: {
                  username: 'master',
                  firstName: 'Master',
                  lastName: 'User',
                  email: 'master@domain.com',
                  password: hash,
                  disabled: false,
                  options: {},
                  roles: 'master',
                },
              },
              {
                model: 'user',
                data: {
                  username: 'masterDeny',
                  firstName: 'Master',
                  lastName: 'User',
                  email: 'masterDeny@domain.com',
                  password: hash,
                  disabled: false,
                  options: {},
                  roles: 'master, deny!user:update',
                },
              },
              {
                model: 'user',
                data: {
                  username: 'device',
                  firstName: 'Device',
                  lastName: 'Creator',
                  email: 'device@domain.com',
                  password: hash,
                  disabled: false,
                  options: {},
                  roles: 'device:create',
                }
              },
              {
                model: 'user',
                data: {
                  username: 'approve',
                  firstName: 'Reservation',
                  lastName: 'Approve',
                  email: 'reservation@domain.com',
                  password: hash,
                  disabled: false,
                  options: {},
                  roles: 'admin, reservation:approve',
                }
              },
              {
                model: 'user',
                data: {
                  username: 'adminAdvisor',
                  firstName: 'Admin',
                  lastName: 'Advisor',
                  email: 'adminAdvisor@domain.com',
                  password: hash,
                  disabled: false,
                  options: {},
                  roles: 'admin, advisor',
                },
              },
              {
                model: 'user',
                data: {
                  username: 'deny',
                  firstName: 'Deny',
                  lastName: 'User',
                  email: 'deny@domain.com',
                  password: hash,
                  disabled: false,
                  options: {},
                  roles: 'deny!user:update, user:update',
                },
              },
              {
                model: 'user',
                data: {
                  username: 'ownerDeny',
                  firstName: 'Owner',
                  lastName: 'Deny',
                  email: 'ownerDeny@domain.com',
                  password: hash,
                  disabled: false,
                  options: {},
                  roles: 'user:update, deny!user:update!owner'
                }
              },
              {
                model: 'user',
                data: {
                  username: 'ownerDenyProperty',
                  firstName: 'Owner',
                  lastName: 'Deny',
                  email: 'ownerDenyProperty@domain.com',
                  password: hash,
                  disabled: false,
                  options: {},
                  roles: 'user:update!owner, deny!user:roles:update!owner'
                }
              },
              {
                model: 'user',
                data: {
                  username: 'ownerDenyOverlap',
                  firstName: 'Owner',
                  lastName: 'Deny',
                  email: 'ownerDenyOverlap@domain.com',
                  password: hash,
                  disabled: false,
                  options: {},
                  roles: 'user:update, deny!user:update!owner, user:roles:update!owner'
                }
              },
              {
                model: 'user',
                data: {
                  username: 'ownerDenyReservation',
                  firstName: 'Owner',
                  lastName: 'Deny',
                  email: 'ownerDenyReservation@domain.com',
                  password: hash,
                  disabled: false,
                  options: {},
                  roles: 'reservation:update, deny!reservation:update!owner'
                },
              },
              {
                model: 'user',
                data: {
                  username: 'ownerDenyReservationProperty',
                  firstName: 'Owner',
                  lastName: 'Deny',
                  email: 'ownerDenyReservationProperty@domain.com',
                  password: hash,
                  disabled: false,
                  options: {},
                  roles: 'reservation:update, deny!reservation:approved:update!owner'
                },
              }
            ]);
          });
        });
      }));
};
