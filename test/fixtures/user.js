const bcrypt = require('bcryptjs');

module.exports = async function (models) {
  const organization = await models.organization.findOne({
    where: {
      name: 'utdtv',
    },
  });

  const alternate = await models.organization.findOne({
    where: {
      name: 'themercury'
    },
  });
  
  const radio = await models.organization.findOne({
    where: {
      name: 'radio'
    },
  });

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
                  currentOrganizationId: organization.id,
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
                  currentOrganizationId: organization.id,
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
                  currentOrganizationId: organization.id,
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
                  currentOrganizationId: organization.id,
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
                  currentOrganizationId: organization.id,
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
                  currentOrganizationId: organization.id,
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
                  currentOrganizationId: organization.id,
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
                  currentOrganizationId: organization.id,
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
                  currentOrganizationId: organization.id,
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
                  currentOrganizationId: organization.id,
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
                  currentOrganizationId: organization.id,
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
                  currentOrganizationId: organization.id,
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
                  currentOrganizationId: organization.id,
                },
              },
              {
                model: 'user',
                data: {
                  username: 'mercury',
                  firstName: 'Mercury',
                  lastName: 'User',
                  email: 'mercuryUser@domain.com',
                  password: hash,
                  disabled: false,
                  options: {},
                  currentOrganizationId: alternate.id,
                },
              },
              {
                model: 'user',
                data: {
                  username: 'editroles',
                  firstName: 'Edit',
                  lastName: 'Roles',
                  email: 'editRoles@domain.com',
                  password: hash,
                  disabled: false,
                  options: {},
                  currentOrganizationId: organization.id,
                },
              },
              {
                model: 'user',
                data: {
                  username: 'editorganizations',
                  firstName: 'Edit',
                  lastName: 'Organizations',
                  email: 'editOrganizations@domain.com',
                  password: hash,
                  disabled: false,
                  options: {},
                  currentOrganizationId: alternate.id,
                },
              },
              {
                model: 'user',
                data: {
                  username: 'radiouser',
                  firstName: 'Radio',
                  lastName: 'User',
                  email: 'radioUser@domain.com',
                  password: hash,
                  disabled: false,
                  options: {},
                  currentOrganizationId: radio.id,
                },
              },
              {
                model: 'user',
                data: {
                  username: 'radioadmin',
                  firstName: 'Radio',
                  lastName: 'Admin',
                  email: 'radioAdmin@domain.com',
                  password: hash,
                  disabled: false,
                  options: {},
                  currentOrganizationId: radio.id,
                },
              }
            ]);
          });
        });
      }));
};
