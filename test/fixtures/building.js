module.exports = function (models) {
  return new Promise((resolve, reject) => {
    return models.building.destroy({ where: {} })
      .then(() => {
        resolve([
          {
            model: 'building',
            data: {
              name: 'SU',
              label: 'Student Union',
            },
          },
        ]);
      });
  });
};
