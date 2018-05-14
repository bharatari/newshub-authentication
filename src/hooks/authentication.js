const errors = require('@feathersjs/errors');
const _ = require('lodash');

exports.disabled = function (options) {
  return function (hook) {
    const models = hook.app.get('sequelize').models;
    
    return models.user.findOne({
      where: {
        email: hook.data.email,
      },
    }).then((user) => {
      if (user) {
        if (user.disabled) {
          throw new errors.Forbidden('USER_DISABLED');
        } else {
          return hook;
        }
      } else {
        throw new errors.BadRequest('USER_DOES_NOT_EXIST');
      } 
    }).catch((err) => {
      throw err;
    });
    
    return hook;
  };
};

exports.normalize = function (options) {
  return function (hook) {
    if (hook.data.email) {
      if (_.isString(hook.data.email)) {
        hook.data.email = hook.data.email.toLowerCase().trim();
      } else {
        return errors.BadRequest();
      }
    } else {
      return errors.BadRequest();
    }
  };
};
