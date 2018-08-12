'use strict';

const moment = require('moment');
const errors = require('@feathersjs/errors');
const general = require('../../../utils/general');

module.exports = function (options) {
  return function (hook) {
    const models = hook.app.get('sequelize').models;

    const email = general.cleanString(hook.data.email);

    return models.user.findOne({
      where: {
        email,
      },
    }).then(user => user.update({
      password: hook.data.password,
    }).then((result) => {
      delete hook.data;

      hook.data = {
        email,
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
