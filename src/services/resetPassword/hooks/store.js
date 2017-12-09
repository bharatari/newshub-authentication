'use strict';

const moment = require('moment');
const errors = require('@feathersjs/errors');

module.exports = function (options) {
  return function (hook) {
    const models = hook.app.get('sequelize').models;

    return models.user.findOne({
      where: {
        email: hook.data.email,
      },
    }).then(user => user.update({
      password: hook.data.password,
    }).then((result) => {
      const data = hook.data;

      delete hook.data;

      hook.data = {
        email: data.email,
        used: true,
      };

      return hook;
    }).catch((err) => {
      throw new errors.GeneralError(err);
    })).catch((err) => {
      throw err;
    });
  };
};
