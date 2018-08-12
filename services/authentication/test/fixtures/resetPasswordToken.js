module.exports = function (models) {
  return new Promise((resolve, reject) => {
    return models.resetPasswordToken.destroy({ where: {} })
      .then(() => {
        resolve([
          {
            model: 'resetPasswordToken',
            data: {
              email: 'normal',
              expires: '2016-02-14 15:34:46.264+00',
              used: false,
              token: '3jd9dvszu',
            },
          },
          {
            model: 'resetPasswordToken',
            data: {
              email: 'normal',
              expires: new Date(),
              used: true,
              token: '2jdedvszu',
            },
          },
        ]);
      });
  });
};
