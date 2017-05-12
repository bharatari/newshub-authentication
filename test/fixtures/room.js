module.exports = function (models) {
  return new Promise((resolve, reject) => {
    return models.room.destroy({ where: {} })
      .then(() => {
        resolve([
          {
            model: 'room',
            data: {
              name: 'STUDENT_MEDIA_SUITE_STUDIO',
              label: 'Student Media Studio',
              buildingId: 1,
              capacity: 0,
            },
          },
        ]);
      });
  });
};
