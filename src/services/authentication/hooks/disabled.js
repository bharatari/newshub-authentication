'use strict';

const errors = require('feathers-errors');

module.exports = function () {
  return function (hook) {
    const models = hook.app.get('sequelize').models;

    return models.user.findOne({
      where: {
        username: hook.data.username,
      },
    }).then((user) => {
      if (user) {
        if (user.disabled) {
          throw new errors.NotAuthenticated('USER_DISABLED');
        } else {
          return hook;
        }
      } else {
        throw new errors.BadRequest('USER_DOES_NOT_EXIST');
      } 
    }).catch((err) => {
      throw err;
    });
  };
};
