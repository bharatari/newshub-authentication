const moment = require('moment');

module.exports = function (models) {
  return new Promise((resolve, reject) => {
    return models.signupToken.destroy({ where: {} })
      .then(() => {
        resolve([
          {
            model: 'signupToken',
            data: {
              token: 'TOKEN_1',
              expires: moment().add(1, 'hour').toDate(),
              hasBeenUsed: false
            },
          },
          {
            model: 'signupToken',
            data: {
              token: 'TOKEN_2',
              expires: moment().add(1, 'hour').toDate(),
              hasBeenUsed: false
            },
          },
        ]);
      });
  });
};
