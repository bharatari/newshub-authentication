module.exports = async function (models) {
  const organization = await models.organization.findOne({
    where: {
      name: 'utdtv',
    },
  });

  return new Promise((resolve, reject) => {
    return models.role.destroy({ where: {} })
      .then(() => {
        resolve([
          {
            model: 'role',
            data: {
              name: 'admin',
              permissions: 'device:read, device:update, reservation:create, reservation:read, reservation:delete, reservation:update, reservation:approve, roomReservation:create, roomReservation:read, roomReservation:delete, roomReservation:update, roomReservation:approve, user:update, deny!user:roles:update, deny!user:disabled:update, deny!user:doNotDisturb:update, user:view-disabled',
              organizationId: organization.id,
            },
          },
          {
            model: 'role',
            data: {
              name: 'advisor',
              permissions: 'user:delete',
              organizationId: organization.id,
            },
          },
          {
            model: 'role',
            data: {
              name: 'member',
              permissions: 'reservation:read, device:read, reservation:create, user:firstName:update!owner, user:lastName:update!owner, user:title:update!owner',
              organizationId: organization.id,  
            }
          },
        ]);
      });
  });
};
