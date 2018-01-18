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
                  email: 'normal@sitrea.com',
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
                  email: 'admin@sitrea.com',
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
                  email: 'master@sitrea.com',
                  password: hash,
                  disabled: false,
                  options: {},
                  currentOrganizationId: organization.id,
                },
              },
              {
                model: 'user',
                data: {
                  username: 'masterdeny',
                  firstName: 'Master',
                  lastName: 'User',
                  email: 'masterDeny@sitrea.com',
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
                  email: 'device@sitrea.com',
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
                  email: 'reservation@sitrea.com',
                  password: hash,
                  disabled: false,
                  options: {},
                  currentOrganizationId: organization.id,
                }
              },
              {
                model: 'user',
                data: {
                  username: 'approvespecial',
                  firstName: 'Special',
                  lastName: 'Approve',
                  email: 'approveSpecial@sitrea.com',
                  password: hash,
                  disabled: false,
                  options: {},
                  currentOrganizationId: organization.id,
                }
              },
              {
                model: 'user',
                data: {
                  username: 'adminadvisor',
                  firstName: 'Admin',
                  lastName: 'Advisor',
                  email: 'adminAdvisor@sitrea.com',
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
                  email: 'deny@sitrea.com',
                  password: hash,
                  disabled: false,
                  options: {},
                  currentOrganizationId: organization.id,
                },
              },
              {
                model: 'user',
                data: {
                  username: 'ownerdeny',
                  firstName: 'Owner',
                  lastName: 'Deny',
                  email: 'ownerDeny@sitrea.com',
                  password: hash,
                  disabled: false,
                  options: {},
                  currentOrganizationId: organization.id,
                }
              },
              {
                model: 'user',
                data: {
                  username: 'ownerdenyproperty',
                  firstName: 'Owner',
                  lastName: 'Deny',
                  email: 'ownerDenyProperty@sitrea.com',
                  password: hash,
                  disabled: false,
                  options: {},
                  currentOrganizationId: organization.id,
                }
              },
              {
                model: 'user',
                data: {
                  username: 'ownerdenyoverlap',
                  firstName: 'Owner',
                  lastName: 'Deny',
                  email: 'ownerDenyOverlap@sitrea.com',
                  password: hash,
                  disabled: false,
                  options: {},
                  currentOrganizationId: organization.id,
                }
              },
              {
                model: 'user',
                data: {
                  username: 'ownerdenyreservation',
                  firstName: 'Owner',
                  lastName: 'Deny',
                  email: 'ownerDenyReservation@sitrea.com',
                  password: hash,
                  disabled: false,
                  options: {},
                  currentOrganizationId: organization.id,
                },
              },
              {
                model: 'user',
                data: {
                  username: 'ownerdenyreservationproperty',
                  firstName: 'Owner',
                  lastName: 'Deny',
                  email: 'ownerDenyReservationProperty@sitrea.com',
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
                  email: 'mercuryUser@sitrea.com',
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
                  email: 'editRoles@sitrea.com',
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
                  email: 'editOrganizations@sitrea.com',
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
                  email: 'radioUser@sitrea.com',
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
                  email: 'radioAdmin@sitrea.com',
                  password: hash,
                  disabled: false,
                  options: {},
                  currentOrganizationId: radio.id,
                },
              },
              {
                model: 'user',
                data: {
                  username: 'nondatabase',
                  firstName: 'Non',
                  lastName: 'Database',
                  email: 'nonDatabase@sitrea.com',
                  password: hash,
                  disabled: false,
                  options: {},
                  currentOrganizationId: organization.id,
                },
              }
            ]);
          });
        });
      }));
};
