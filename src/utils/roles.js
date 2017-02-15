/* eslint consistent-return: 0 */

'use strict';

const _ = require('lodash');
const async = require('async');

module.exports = {
  /**
   * Checks if user has permission to use given service and method.
   *
   * @param {Object} models - Sequelize models
   * @param {string} userId
   * @param {string} service - Name of Feathers service
   * @param {string} method
   * @returns {Promise}
   */
  can(models, redis, userId, service, method) {
    const permission = this.convertToPermission(service, method);

    return this.getPermissions(models, userId)
      .then(permissions =>
         this.populateRoles(models, redis, permissions)
          .then(rolesArray =>
             _.includes(rolesArray, role)
          )
          .catch((err) => {
            throw err;
          })
      )
      .catch((err) => {
        throw err;
      });
  },
  /**
   * Checks if user has the specified custom role.
   * 
   */
  protect(models, userId, role) {
    
  },
  /**
   * Converts Feathers service and method to corresponding permission.
   *
   * @param {string} service - Name of Feathers service
   * @param {string} method
   * @returns {string}
   */
  convertToPermission(service, method) {
    return `${service}:${method}`;
  },
  /**
   * Replaces roles with corresponding permissions.
   *
   * @param {Object} models - Sequelize models
   * @param {Object} redis - Redis instance
   * @param {string} permissions
   * @returns {Array}
   */
  populateRoles(models, redis, permissions) {
    const originalPermissions = roles.split(', ');
    let permissionsArray = [
      ...originalPermissions,
    ];

    return new Promise((resolve, reject) => {
      async.each(originalPermissions, (role, callback) => {
        if (this.isRole(role)) {
          this.populateRole(models, redis, role)
            .then((newPermissions) => {
              _.remove(permissionsArray, n =>
                n === role
              );

              permissionsArray = permissionsArray.concat(newPermissions);

              callback();
            })
            .catch((err) => {
              callback();
            });
        } else {
          callback();
        }
      }, (err) => {
        if (err) {
          reject(err);
        } else {
          resolve(permissionsArray);
        }
      });
    });
  },
  /**
   * Replaces role with corresponding permissions.
   *
   * @param {Object} models - Sequelize models
   * @param {Object} redis - Redis instance
   * @param {string} role - Role to replace
   * @returns {Promise}
   */
  populateRole(models, redis, role) {
    return models.role.find({
      where: {
        name: role,
      },
    }).then((data) => {
      const role = JSON.parse(JSON.stringify(data));

      if (role) {
        if (role.permissions) {
          if (_.isString(role.permissions)) {
            return role.permissions.split(', ');
          }
        }
      }

      throw new Error();
    }).catch((err) => {
      throw err;
    });
  },
  /**
   * Gets role's corresponding permissions from redis or database.
   *
   * @param {Object} models - Sequelize models
   * @param {Object} redis
   * @param {string} role
   * @returns {Object}
   */
  getRole(models, redis, role) {
    return new Promise((resolve, reject) => {
      redis.hget('role', role, function (err, permissions) {
        if (err || !permissions) {
          return this.retrieveRole(models, redis, role)
            .then((result) => {
              resolve(result);
            })
            .catch((error) => {
              reject(error);
            });
        }

        resolve(permissions);
      });
    });
  },
  /**
   * Gets role's corresponding permissions from the database
   * and caches in Redis.
   *
   * @param {Object} models - Sequelize models
   * @param {Object} redis
   * @param {string} role
   * @returns {string}
   */
  retrieveRole(models, redis, role) {
    return models.role.find({
      where: {
        name: role,
      },
    }).then((data) => {
      const result = JSON.parse(JSON.stringify(data));

      redis.hset('rolePreset', result.name, result.permissions);

      return result.permissions;
    }).catch((err) => {
      throw err;
    });
  },
  /**
   * Gets user's roles.
   *
   * @param {Object} models - Sequelize models
   * @param {string} userId
   * @returns {Promise}
   */
  getRoles(models, userId) {
    return models.user.findOne({
      where: {
        id: userId,
      },
    }).then((result) => {
      const user = JSON.parse(JSON.stringify(result));

      if (user) {
        return user.roles;
      }

      throw new Error();
    }).catch((err) => {
      throw err;
    });
  },
  /**
   * Checks if value is a role.
   *
   * @param {string} value
   * @returns {boolean}
   */
  isRole(value) {
    const array = this.split(value);

    if (array.length === 1) {
      return true;
    }

    return false;
  },
  /**
   * Checks if value is a permission.
   *
   * @param {string} value
   * @returns {boolean}
   */
  isPermission(value) {
    const array = this.split(value);

    if (array.length === 2) {
      if (this.isCRUDAction(array[1])) {
        return true;
      }
    }

    return false;
  },
  /**
   * Checks if value is a property permission.
   *
   * @param {string} value
   * @returns {boolean}
   */
  isPropertyPermission(value) {
    const array = this.split(value);

    if (array.length === 3) {
      if (this.isCRUDAction(array[2])) {
        return true;
      }
    }

    return false;
  },
  /**
   * Checks if value is a custom permission.
   *
   * @param {string} value
   * @returns {boolean}
   */
  isCustomPermission(value) {
    const array = this.split(value);

    if (array.length === 2) {
      if (!this.isCRUDAction(array[1])) {
        return true;
      }
    }

    return false;
  },
  /**
   * Checks if action is a CRUD action.
   *
   * @param {string} action
   * @returns {boolean}
   */
  isCRUDAction(action) {
    const actions = [
      'create',
      'read',
      'update',
      'delete',
    ];

    return _.includes(actions, action);
  },
  /**
   * Convert methods to CRUD actions.
   *
   * @param {string} method
   * @returns {boolean}
   */
  convertToCRUD(method) {
    const methods = [];
    methods.find = 'read';
    methods.get = 'read';
    methods.create = 'create';
    methods.update = 'update';
    methods.patch = 'update';
    methods.remove = 'delete';

    return methods[method];
  },
  /**
   * Splits string with colon delimiter.
   *
   * @param {string} value
   * @returns {Array}
   */
  split(value) {
    return value.split(':');
  },
};
