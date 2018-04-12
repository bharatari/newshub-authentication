const errors = require('@feathersjs/errors');
const _ = require('lodash');

exports.disabled = function (options) {
  return function (hook) {
    const models = hook.app.get('sequelize').models;
    
    return models.user.findOne({
      where: {
        username: hook.data.username,
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
    if (hook.data.username) {
      if (_.isString(hook.data.username)) {
        hook.data.username = hook.data.username.toLowerCase().trim();
      } else {
        return errors.BadRequest();
      }
    } else {
      return errors.BadRequest();
    }
  };
};
