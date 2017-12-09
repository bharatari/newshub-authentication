const async = require('async');

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

  const roles = [
    { username: 'normal', roles: null, organizations: [{ id: alternate.id, roles: null }] },
    { username: 'admin', roles: 'admin' },
    { username: 'master', roles: 'master' },
    { username: 'masterdeny', roles: 'master, deny!user:update' },
    { username: 'device', roles: 'device:create' },
    { username: 'approve', roles: 'admin, reservation:approve' },
    { username: 'approvespecial', roles: 'reservation:approve, technology-director, reservation:special-requests' },
    { username: 'adminadvisor', roles: 'admin, advisor' },
    { username: 'deny', roles: 'deny!user:update, user:update' },
    { username: 'ownerdeny', roles: 'user:update, deny!user:update!owner' },
    { username: 'ownerdenyproperty', roles: 'user:update!owner, deny!user:roles:update!owner' },
    { username: 'ownerdenyoverlap', roles: 'user:update, deny!user:update!owner, user:roles:update!owner' },
    { username: 'ownerdenyreservation', roles: 'reservation:update, deny!reservation:update!owner, roomReservation:update, deny!roomReservation:update!owner' },
    { username: 'ownerdenyreservationproperty', roles: 'reservation:update, deny!reservation:approved:update!owner, roomReservation:update, deny!roomReservation:approved:update!owner' },
    { username: 'editroles', roles: 'member' },
    { username: 'radiouser', roles: null },
    { username: 'radioadmin', roles: 'reservation:update, roomReservation:update' },
    { username: 'nondatabase', roles: 'not-database-role' },
  ];

  try {
    for (let i = 0; i < roles.length; i++) {
      const user = await models.user.findOne({ where: { username: roles[i].username } });

      await user.addOrganization(user.currentOrganizationId, { through: { roles: roles[i].roles }});
    
      if (roles[i].organizations) {
        for (let e = 0; e < roles[i].organizations.length; e++) {
          await user.addOrganization(roles[i].organizations[e].id, { through: { roles: roles[i].organizations[e].roles }});
        }
      }
    }
  } catch (e) {
    throw e;
  }

  const specialReservation = await models.reservation.findOne({
    notes: 'SPECIAL',
  });

  const specialDevice = await models.device.findOne({
    name: 'SPECIAL',
  })

  await specialReservation.addDevice(specialDevice.id, { through: { quantity: 1 }});
};
