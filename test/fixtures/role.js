module.exports = function (models) {
  return new Promise((resolve, reject) => {
    return models.role.destroy({ where: {} })
      .then(() => {
        resolve([
          {
            model: 'role',
            data: {
              name: 'admin',
              permissions: 'device:read, device:update, reservation:create, reservation:read, reservation:delete, reservation:update, user:update, deny!user:roles:update, deny!user:disabled:update, deny!user:doNotDisturb:update',
            },
          },
          {
            model: 'role',
            data: {
              name: 'advisor',
              permissions: 'user:delete'
            },
          },
          {
            model: 'role',
            data: {
              name: 'member',
              permissions: 'reservation:read, device:read, reservation:create, user:firstName:update!owner, user:lastName:update!owner, user:title:update!owner'
            }
          }
        ]);
      });
  });
};
