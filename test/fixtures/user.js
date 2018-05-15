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
                  email: 'normal',
                  firstName: 'Normal',
                  lastName: 'User',
                  password: hash,
                  disabled: false,
                  options: {},
                  currentOrganizationId: organization.id,
                },
              },
              {
                model: 'user',
                data: {
                  email: 'admin',
                  firstName: 'Admin',
                  lastName: 'User',
                  password: hash,
                  disabled: false,
                  options: {},
                  currentOrganizationId: organization.id,
                },
              },
              {
                model: 'user',
                data: {
                  email: 'master',
                  firstName: 'Master',
                  lastName: 'User',
                  password: hash,
                  disabled: false,
                  options: {},
                  currentOrganizationId: organization.id,
                },
              },
              {
                model: 'user',
                data: {
                  email: 'masterdeny',
                  firstName: 'Master',
                  lastName: 'User',
                  password: hash,
                  disabled: false,
                  options: {},
                  currentOrganizationId: organization.id,
                },
              },
              {
                model: 'user',
                data: {
                  email: 'device',
                  firstName: 'Device',
                  lastName: 'Creator',
                  password: hash,
                  disabled: false,
                  options: {},
                  currentOrganizationId: organization.id,
                }
              },
              {
                model: 'user',
                data: {
                  email: 'approve',
                  firstName: 'Reservation',
                  lastName: 'Approve',
                  password: hash,
                  disabled: false,
                  options: {},
                  currentOrganizationId: organization.id,
                }
              },
              {
                model: 'user',
                data: {
                  email: 'approvespecial',
                  firstName: 'Special',
                  lastName: 'Approve',
                  password: hash,
                  disabled: false,
                  options: {},
                  currentOrganizationId: organization.id,
                }
              },
              {
                model: 'user',
                data: {
                  email: 'adminadvisor',
                  firstName: 'Admin',
                  lastName: 'Advisor',
                  password: hash,
                  disabled: false,
                  options: {},
                  currentOrganizationId: organization.id,
                },
              },
              {
                model: 'user',
                data: {
                  email: 'deny',
                  firstName: 'Deny',
                  lastName: 'User',
                  password: hash,
                  disabled: false,
                  options: {},
                  currentOrganizationId: organization.id,
                },
              },
              {
                model: 'user',
                data: {
                  email: 'ownerdeny',
                  firstName: 'Owner',
                  lastName: 'Deny',
                  password: hash,
                  disabled: false,
                  options: {},
                  currentOrganizationId: organization.id,
                }
              },
              {
                model: 'user',
                data: {
                  email: 'ownerdenyproperty',
                  firstName: 'Owner',
                  lastName: 'Deny',
                  password: hash,
                  disabled: false,
                  options: {},
                  currentOrganizationId: organization.id,
                }
              },
              {
                model: 'user',
                data: {
                  email: 'ownerdenyoverlap',
                  firstName: 'Owner',
                  lastName: 'Deny',
                  password: hash,
                  disabled: false,
                  options: {},
                  currentOrganizationId: organization.id,
                }
              },
              {
                model: 'user',
                data: {
                  email: 'ownerdenyreservation',
                  firstName: 'Owner',
                  lastName: 'Deny',
                  password: hash,
                  disabled: false,
                  options: {},
                  currentOrganizationId: organization.id,
                },
              },
              {
                model: 'user',
                data: {
                  email: 'ownerdenyreservationproperty',
                  firstName: 'Owner',
                  lastName: 'Deny',
                  password: hash,
                  disabled: false,
                  options: {},
                  currentOrganizationId: organization.id,
                },
              },
              {
                model: 'user',
                data: {
                  email: 'mercury',
                  firstName: 'Mercury',
                  lastName: 'User',
                  password: hash,
                  disabled: false,
                  options: {},
                  currentOrganizationId: alternate.id,
                },
              },
              {
                model: 'user',
                data: {
                  email: 'editroles',
                  firstName: 'Edit',
                  lastName: 'Roles',
                  password: hash,
                  disabled: false,
                  options: {},
                  currentOrganizationId: organization.id,
                },
              },
              {
                model: 'user',
                data: {
                  email: 'editorganizations',
                  firstName: 'Edit',
                  lastName: 'Organizations',
                  password: hash,
                  disabled: false,
                  options: {},
                  currentOrganizationId: alternate.id,
                },
              },
              {
                model: 'user',
                data: {
                  email: 'radiouser',
                  firstName: 'Radio',
                  lastName: 'User',
                  password: hash,
                  disabled: false,
                  options: {},
                  currentOrganizationId: radio.id,
                },
              },
              {
                model: 'user',
                data: {
                  email: 'radioadmin',
                  firstName: 'Radio',
                  lastName: 'Admin',
                  password: hash,
                  disabled: false,
                  options: {},
                  currentOrganizationId: radio.id,
                },
              },
              {
                model: 'user',
                data: {
                  email: 'nondatabase',
                  firstName: 'Non',
                  lastName: 'Database',
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
