/* eslint consistent-return: 0 */

'use strict';

const _ = require('lodash');
const async = require('async');

module.exports = {
  userModel: 'user',
  userIdField: 'userId',

  check(models, redis, userId, service, method, property, record, previousRecord) {
    // detect differences in properties for update
    // validate against roles

    // for create, check deny permissions for properties
    // the user is allowed or not allowed to create

    // check for standard roles otherwise
  },

  /**
   * Checks if user has permission to use given service and method.
   *
   * @public
   * @param {Object} models - Sequelize models
   * @param {string} userId
   * @param {string} service - Name of Feathers service
   * @param {string} method
   * @returns {Promise}
   */
  async can(models, redis, userId, service, method, property, id) {
    const permission = this.convertToPermission(service, method, property);

    if (!_.isNil(property)) {
      const upperPermission = this.convertToUpperPermission(permission);

      try {
        const hasPermission = await this.has(models, redis, userId, permission, service, id);
        const cannotPermission = await this.cannot(models, redis, userId, permission, service, id);

        const hasUpperPermission = await this.has(models, redis, userId, upperPermission, service, id);
        const cannotUpperPermission = await this.cannot(models, redis, userId, upperPermission, service, id);

        if (hasPermission && !cannotPermission) {
          return true;
        } else if (hasUpperPermission && !cannotUpperPermission && !cannotPermission) {
          return true;
        } else {
          return false;
        }
      } catch (e) {
        throw e;
      }
    }

    try {
      const hasPermission = await this.has(models, redis, userId, permission, service, id);
      const cannotPermission = await this.cannot(models, redis, userId, permission, service, id);

      if (hasPermission && !cannotPermission) {
        return true;
      }

      return false;
    } catch (e) {
      throw e;
    }
  },

  /**
   * Checks if user has the given permission. Used by
   * the can function and also can be used for checking
   * and custom permissions.
   * 
   * @public
   */
  has(models, redis, userId, permission, model, id) {
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
            this.includesPermission(models, permissionsArray, permission, userId, model, id)
          )
      })
      .catch((err) => {
        throw err;
      });
  },

  /**
   * Checks if user has the specified role.
   * 
   * @public
   */
  is(models, userId, role) {
    return this.getUserRoles(models, userId)
      .then(roles =>
        this.includes(roles, role)
      )
      .catch((err) => {
        throw err;
      });
  },

  async resolve(models, redis, userId) {
    const roles = await this.getUserRoles(models, userId);
    const permissions = await this.populateRoles(models, redis, roles);

    if (roles) {
      const rolesArray = roles.split(', ');
      rolesArray.concat(permissions);

      return rolesArray;
    }

    return [];
  },

  /**
   * Checks if there is a deny permission for the given
   * permission.
   * 
   * @private
   */
  cannot(models, redis, userId, permission, model, id) {
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
          .then((permissionsArray) => {
            return this.includesPermission(models, permissionsArray, denyPermission, userId, model, id)
              .then((deny) => {
                return deny;
              });
          })
      })
      .catch((err) => {
        throw err;
      });
  },

  /**
   * Strict check of whether the permission exists in the
   * collection.
   * 
   * @private
   */
  includes(collection, item) {
    return _.includes(collection, item);
  },

  /**
   * Check if the specified permission is included in the
   * array of permissions. Handles owner check.
   * 
   * @private
   */
  includesPermission(models, permissions, permission, userId, model, id) {
    return new Promise((resolve, reject) => {
      if (this.includes(permissions, permission)) {
        resolve(true);
      } else if (!_.isNil(id)) {
        const ownerPermission = `${permission}!owner`;

        if (this.includes(permissions, ownerPermission)) {
          return this.getRecord(models, model, id)
            .then((data) => {              
              if (model === this.userModel) {
                if (data.id === userId) {
                  resolve(true);
                } else {
                  resolve(false);
                }
              } else {
                if (data[this.userIdField] === userId) {
                  resolve(true);
                } else {
                  resolve(false);
                }
              }
            }).catch((err) => {
              reject(err);
            });
        } else {
          resolve(false);
        }
      } else {
        resolve(false);
      }      
    });
  },

  /**
   * Gets specified record with Sequelize.
   * 
   * @private
   */
  getRecord(models, model, id) {
    return models[model].findOne({
      where: {
        id,
      },
    }).then((result) => {
      const data = JSON.parse(JSON.stringify(result));

      return data;
    }).catch((err) => {
      throw err;
    });
  },

  /**
   * Converts Feathers service and method to corresponding permission.
   *
   * @private
   * @param {string} service - Name of Feathers service
   * @param {string} method
   * @returns {string}
   */
  convertToPermission(service, method, property) {
    if (!_.isNil(property)) {
      return `${service}:${property}:${method}`
    }

    return `${service}:${method}`;
  },

  /**
   * Replaces roles with corresponding permissions.
   *
   * @private
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
   * @private
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
   * @private
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
   * @private
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
   * @private
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

      throw new Error();
    }).catch((err) => {
      throw err;
    });
  },

  /**
   * Checks if value is a role.
   *
   * @private
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
   * @private
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
   * @private
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
   * @private
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
   * @private
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
   * 
   * @private
   */
  convertToUpperPermission(permission) {
    const array = permission.split(':');

    return `${array[0]}:${array[2]}`;
  },

  /**
   * Convert property permission to a deny property permission.
   * 
   * @private
   */
  convertToDenyPermission(permission) {
    return `deny!${permission}`;
  },

  /**
   * Convert methods to CRUD actions.
   *
   * @private
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
   * @private
   * @param {string} value
   * @returns {Array}
   */
  split(value) {
    return value.split(':');
  },
};
