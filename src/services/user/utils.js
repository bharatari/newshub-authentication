'use strict';

const async = require('async');
const _ = require('lodash');

module.exports = {
  isAdmin(user) {
    if (user.dataValues) {
      if (user.dataValues.roles) {
        if (_.isString(user.dataValues.roles)) {
          return user.dataValues.roles.includes('admin') || user.dataValues.roles.includes('master');
        }
      }
    }
    
    return false;
  },
  isMaster(user) {
    if (user.dataValues) {
      if (user.dataValues.roles) {
        if (_.isString(user.dataValues.roles)) {
          return user.dataValues.roles.includes('master');
        }
      }
    }
    
    return false;
  },
};
