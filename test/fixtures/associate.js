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
    { username: 'masterDeny', roles: 'master, deny!user:update' },
    { username: 'device', roles: 'device:create' },
    { username: 'approve', roles: 'admin, reservation:approve' },
    { username: 'adminAdvisor', roles: 'admin, advisor' },
    { username: 'deny', roles: 'deny!user:update, user:update' },
    { username: 'ownerDeny', roles: 'user:update, deny!user:update!owner' },
    { username: 'ownerDenyProperty', roles: 'user:update!owner, deny!user:roles:update!owner' },
    { username: 'ownerDenyOverlap', roles: 'user:update, deny!user:update!owner, user:roles:update!owner' },
    { username: 'ownerDenyReservation', roles: 'reservation:update, deny!reservation:update!owner, roomReservation:update, deny!roomReservation:update!owner' },
    { username: 'ownerDenyReservationProperty', roles: 'reservation:update, deny!reservation:approved:update!owner, roomReservation:update, deny!roomReservation:approved:update!owner' },
    { username: 'editroles', roles: 'member' }
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
};
