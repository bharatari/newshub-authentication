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
              capacity: 0,
            },
          },
          {
            model: 'room',
            data: {
              name: 'STUDENT_MEDIA_SUITE_STUDIO_2',
              label: 'Student Media Studio 2',
              capacity: 0,
            },
          },
        ]);
      });
  });
};
