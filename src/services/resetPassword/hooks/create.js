'use strict';

const Chance = require('chance');
const chance = new Chance();
const moment = require('moment');
const errors = require('feathers-errors');
const email = require('../../../utils/email');

module.exports = function (options) {
  return function (hook) {
    const models = hook.app.get('sequelize').models;

    hook.data.token = chance.hash({ casing: 'lower', length: 12 });
    hook.data.expires = moment().add(1, 'days').toDate();

    return models.user.findOne({
      where: {
        email: hook.data.email,
      },
    }).then((result) => {
      if (!result) {
        throw new errors.BadRequest('USER_NOT_FOUND_RESET_PASSWORD_TOKEN');
      }

      hook.data.userId = result.id;
      hook.data.email = result.email;

      return email.sendEmail(hook.app, hook.data.email, "Password Reset", hook.data.token, 'RESET_PASSWORD')
        .then((result) => {
          return hook;
        })
        .catch((err) => {
          throw new errors.GeneralError(err);
        });
    }).catch((err) => {
      throw err;
    });
  };
};
