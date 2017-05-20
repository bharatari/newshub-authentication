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
    }).then(async (result) => {
      if (!result) {
        throw new errors.BadRequest('USER_NOT_FOUND_RESET_PASSWORD_TOKEN');
      }

      hook.data.userId = result.id;
      hook.data.email = result.email;

      try {
        await email.queueEmails([{ email: hook.data.email }], 'Password Reset', hook.data.token, 'RESET_PASSWORD')

        return hook;
      } catch (e) {
        throw new errors.GeneralError(e);
      }
    }).catch((err) => {
      throw err;
    });
  };
};
