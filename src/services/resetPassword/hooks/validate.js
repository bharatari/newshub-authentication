'use strict';

const moment = require('moment');
const errors = require('feathers-errors');
const general = require('../../../utils/general');

module.exports = function (options) {
  return function (hook) {
    const models = hook.app.get('sequelize').models;

    return models.resetPasswordToken.findOne({
      where: {
        token: hook.data.resetToken,
      },
    }).then((token) => {
      if (!token) {
        throw new errors.BadRequest('INVALID_RESET_PASSWORD_TOKEN');
      }

      const data = token.toJSON();

      if (general.cleanString(hook.data.email) !== general.cleanString(data.email)) {
        throw new errors.BadRequest('EMAIL_MISMATCH_RESET_PASSWORD_TOKEN');
      } else if (data.used) {
        throw new errors.BadRequest('USED_RESET_PASSWORD_TOKEN');
      } else if (new Date() > new Date(data.expires)) {
        throw new errors.BadRequest('EXPIRED_RESET_PASSWORD_TOKEN');
      } else {
        return hook;
      }
    }).catch((err) => {
      throw err;
    });
  };
};
