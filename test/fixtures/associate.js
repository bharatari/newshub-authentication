const async = require('async');

module.exports = async function (models) {
  const roles = [
    { username: 'normal', roles: null },
    { username: 'admin', roles: 'admin' },
    { username: 'master', roles: 'master' },
    { username: 'masterDeny', roles: 'master, deny!user:update' },
    { username: 'device', roles: 'device:create' },
    { username: 'approve', roles: 'admin, reservation:approve' },
    { username: 'adminAdvisor', roles: 'admin, advisor' },
    { username: 'deny', roles: 'deny!user:update, user:update' },
    { username: 'ownerDeny', roles: 'user:update, deny!user:update!owner' },
    { username: 'ownerDenyProperty', roles: 'user:update!owner, deny!user:roles:update!owner' },
    { username: 'ownerDenyOverlap', roles: 'user:update, deny!user:update!owner, user:roles:update!owner' },
    { username: 'ownerDenyReservation', roles: 'reservation:update, deny!reservation:update!owner' },
    { username: 'ownerDenyReservationProperty', roles: 'reservation:update, deny!reservation:approved:update!owner' },
  ];

  try {
    for (let i = 0; i < roles.length; i++) {
      const user = await models.user.findOne({ where: { username: roles[i].username } });

      await user.addOrganization(user.currentOrganizationId, { roles: roles[i].roles });
    }
  } catch (e) {
    throw e;
  }

  const reservations = [
    { notes: 'VIDEO_SHOOT', organizations: ['utdtv'] },
    { notes: 'VIDEO_SHOOT2', organizations: ['utdtv'] },
    { notes: 'MERCURY', organizations: ['themercury'] },
  ];

  try {
    for (let i = 0; i < reservations.length; i++) {
      const notes = reservations[i].notes;
      const reservation = await models.reservation.findOne({ where: { notes } });
      
      for (let e = 0; e < reservations[i].organizations.length ; e++) {
        const name = reservations[i].organizations[e];
        const organization = await models.organization.findOne({ where: { name } });
        
        await reservation.addOrganization(organization.id, {
          owner: true,
        });
      }
    }
  } catch (e) {
    throw e;
  }

  const devices = [
    { name: 'Mixer 1 Tascam', organizations: ['utdtv'] },
    { name: 'Zoom H4', organizations: ['utdtv'] },
  ];

  try {
    for (let i = 0; i < devices.length; i++) {
      const name = devices[i].name;
      const device = await models.device.findOne({ where: { name } });
      
      for (let e = 0; e < devices[i].organizations.length ; e++) {
        const name = devices[i].organizations[e];
        const organization = await models.organization.findOne({ where: { name } });
        
        await device.addOrganization(organization.id, {
          owner: true,
        });
      }
    }
  } catch (e) {
    throw e;
  }
};
