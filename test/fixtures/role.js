module.exports = function (models) {
  return new Promise((resolve, reject) => {
    return models.role.destroy({ where: {} })
      .then(() => {
        resolve([
          {
            model: 'role',
            data: {
              name: 'admin',
              permissions: 'device:create',
            },
          },
        ]);
      });
  });
};
