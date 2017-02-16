'use strict';

const async = require('async');
const _ = require('lodash');

module.exports = {
  isAdmin(user) {
    if (user) {
      if (user.dataValues) {
        if (user.dataValues.roles) {
          if (_.isString(user.dataValues.roles)) {
            return user.dataValues.roles.includes('admin') || user.dataValues.roles.includes('master');
          }
        }
      } else if (user.roles) {
        if (_.isString(user.roles)) {
          return user.roles.includes('admin') || user.roles.includes('master');
        }
      }
    }

    return false;
  },
  isMaster(user) {
    if (user) {
      if (user.dataValues) {
        if (user.dataValues.roles) {
          if (_.isString(user.dataValues.roles)) {
            return user.dataValues.roles.includes('master');
          }
        }
      } else if (user.roles) {
        if (_.isString(user.roles)) {
          return user.roles.includes('master');
        }
      }
    }

    return false;
  },
};
