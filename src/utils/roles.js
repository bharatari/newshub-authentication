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
  can(models, redis, userId, service, method, property) {
    const permission = this.convertToPermission(service, method, property);

    if (!_.isNil(property)) {
      const upperPermission = this.convertToUpperPermission(permission);

      return this.has(models, redis, userId, permission)
        .then((result) => {
          if (result) {
            return this.cannot(models, redis, userId, permission)
              .then((deny) => {
                if (deny) {
                  return false;
                } else {
                  return true;
                }
              });
          } else {
            return this.has(models, redis, userId, upperPermission)
              .then((upper) => {
                return this.cannot(models, redis, userId, permission)
                  .then((deny) => {
                    if (deny) {
                      return false;
                    } else {
                      return true;
                    }
                  });
              });
          }
        })
        .catch((err) => {
          throw err;
        });
    }
    
    return this.has(models, redis, userId, permission);
  },

  /**
   * Checks if user has the given permission. Used by
   * the can function and also can be used for checking
   * and custom permissions.
   */
  has(models, redis, userId, permission) {
    return this.is(models, userId, 'master')
      .then((result) => {
        if (result) {
          return true;
        }

        return this.getUserRoles(models, userId)
          .then(roles =>
            this.populateRoles(models, redis, roles)
          )
          .then(permissionsArray =>
            this.includesPermission(permissionsArray, permission)
          )
      })
      .catch((err) => {
        throw err;
      });
  },

  /**
   * Checks if there is a deny permission for the given
   * permission.
   */
  cannot(models, redis, userId, permission) {
    const denyPermission = this.convertToDenyPermission(permission);

    return this.is(models, userId, 'master')
      .then((result) => {
        if (result) {
          return false;
        }

        return this.getUserRoles(models, userId)
          .then(roles =>
            this.populateRoles(models, redis, roles)
          )
          .then(permissionsArray =>
            !this.includesPermission(permissionsArray, denyPermission)
          )
      })
      .catch((err) => {
        throw err;
      });
  },

  /**
   * Checks if user has the specified role.
   */
  is(models, userId, role) {
    return this.getUserRoles(models, userId)
      .then(roles =>
        this.includesRole(roles, role)
      )
      .catch((err) => {
        throw err;
      });
  },

  /**
   * Alias of includesPermission function.
   */
  includesRole(roles, role) {
    return this.includesPermission(roles, role);
  },

  /**
   * Check if the specified permission is included in the
   * array of permissions.
   */
  includesPermission(permissions, permission) {
    return _.includes(permissions, permission);
  },

  /**
   * Converts Feathers service and method to corresponding permission.
   *
   * @param {string} service - Name of Feathers service
   * @param {string} method
   * @returns {string}
   */
  convertToPermission(service, method, property) {
    if (!_.isNil(property)) {
      return `${service}:${method}:${property}`
    }

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
  populateRoles(models, redis, roles) {
    let original;

    if (roles && _.isString(roles)) {
      original = roles.split(', ');
    } else {
      original = [];
    }

    let permissions = [
      ...original,
    ];

    return new Promise((resolve, reject) => {
      async.each(original, (role, callback) => {
        if (this.isRole(role)) {
          this.populateRole(models, redis, role)
            .then((newPermissions) => {
              _.remove(permissions, n =>
                n === role
              );

              permissions = permissions.concat(newPermissions);

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
          resolve(permissions);
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

      return [];
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

      redis.hset('role', result.name, result.permissions);

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
  getUserRoles(models, userId) {
    return models.user.findOne({
      where: {
        id: userId,
      },
    }).then((result) => {
      const user = JSON.parse(JSON.stringify(result));

      if (user) {
        return user.roles;
      }

      throw '';
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
   * Convert property permission to a standard CRUD action permission.
   */
  convertToUpperPermission(permission) {
    const array = permission.split(':');

    return `${array[0]}:${array[2]}`;
  },

  /**
   * Convert property permission to a deny property permission.
   */
  convertToDenyPermission(permission) {
    return `deny!${permission}`;
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
