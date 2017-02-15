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
            ]);
          });
        });
      }));
};
