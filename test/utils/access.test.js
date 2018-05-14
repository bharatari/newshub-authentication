/* eslint-env node, mocha */
/* eslint prefer-arrow-callback: 0 */

'use strict';

const assert = require('chai').assert;
const app = require('../../src/app');
const utils = require('../../src/utils/access');
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const _ = require('lodash');

describe('access utils', () => {
  before((done) => {
    chai.use(chaiAsPromised);

    done();
  });

  describe('#can', () => {
    it('should return true for user with explicit permission', () => {
      const models = app.get('sequelize').models;
      const redis = app.get('redis');

      return models.user.findOne({
        where: {
          email: 'device',
        },
      }).then((data) => {
        const user = JSON.parse(JSON.stringify(data));

        return assert.becomes(utils.can(models, redis, user.id, 'device', 'create'), true);
      }).catch((err) => {
        assert.fail();
      });
    });

    it('should return true for user with proper role', () => {
      const models = app.get('sequelize').models;
      const redis = app.get('redis');

      return models.user.findOne({
        where: {
          email: 'admin',
        },
      }).then((data) => {
        const user = JSON.parse(JSON.stringify(data));

        return assert.becomes(utils.can(models, redis, user.id, 'user', 'update'), true);
      }).catch((err) => {
        assert.fail();
      });
    });

    it('should always return true for master user', () => {
      const models = app.get('sequelize').models;
      const redis = app.get('redis');

      return models.user.findOne({
        where: {
          email: 'master',
        },
      }).then((data) => {
        const user = JSON.parse(JSON.stringify(data));

        return assert.becomes(utils.can(models, redis, user.id, 'user', 'create'), true);
      }).catch((err) => {
        assert.fail();
      });
    });

    it('should return true for master user even with deny', () => {
      const models = app.get('sequelize').models;
      const redis = app.get('redis');

      return models.user.findOne({
        where: {
          email: 'masterdeny',
        },
      }).then((data) => {
        const user = JSON.parse(JSON.stringify(data));

        return assert.becomes(utils.can(models, redis, user.id, 'user', 'update'), true);
      }).catch((err) => {
        assert.fail();
      });
    });

    it('should handle deny as taking precedence in case of overlap', () => {
      const models = app.get('sequelize').models;
      const redis = app.get('redis');

      return models.user.findOne({
        where: {
          email: 'deny',
        },
      }).then((data) => {
        const user = JSON.parse(JSON.stringify(data));

        return assert.becomes(utils.can(models, redis, user.id, 'user', 'update'), false);
      }).catch((err) => {
        assert.fail();
      });
    });

    it('should return false for denied property permission', () => {
      const models = app.get('sequelize').models;
      const redis = app.get('redis');

      return models.user.findOne({
        where: {
          email: 'admin',
        },
      }).then((data) => {
        const user = JSON.parse(JSON.stringify(data));

        return assert.becomes(utils.can(models, redis, user.id, 'user', 'update', 'roles'), false);
      }).catch((err) => {
        assert.fail();
      });
    });

    it('should return false for user without any permissions or roles', () => {
      const models = app.get('sequelize').models;
      const redis = app.get('redis');

      return models.user.findOne({
        where: {
          email: 'normal',
        },
      }).then((data) => {
        const user = JSON.parse(JSON.stringify(data));

        return assert.becomes(utils.can(models, redis, user.id, 'reservation', 'update', 'approved'), false);
      }).catch((err) => {
        assert.fail();
      });
    });

    it('should return false for user with role but not specific permission', () => {
      const models = app.get('sequelize').models;
      const redis = app.get('redis');

      return models.user.findOne({
        where: {
          email: 'admin',
        },
      }).then((data) => {
        const user = JSON.parse(JSON.stringify(data));

        return assert.becomes(utils.can(models, redis, user.id, 'user', 'delete'), false);
      }).catch((err) => {
        assert.fail();
      });
    });

    it('should handle id', async () => {
      const models = app.get('sequelize').models;
      const redis = app.get('redis');

      const reservation = await models.reservation.findOne({
        where: {
          notes: 'VIDEO_SHOOT3',
        },
      });
      
      const user = await models.user.findOne({
        where: {
          email: 'ownerdenyreservation',
        }
      });

      assert.becomes(utils.can(models, redis, user.id, 'reservation', 'update', null), true);

      return assert.becomes(utils.can(models, redis, user.id, 'reservation', 'update', null, reservation.id), false);
    });

    it('should not throw error for user with non-existent roles', async () => {
      const models = app.get('sequelize').models;
      const redis = app.get('redis');

      const user = await models.user.findOne({
        where: {
          email: 'normal',
        }
      });

      return assert.becomes(utils.can(models, redis, user.id, 'reservation', 'update'), false);
    });

    it('should not throw error for user with non-existent permissions', async () => {
      const models = app.get('sequelize').models;
      const redis = app.get('redis');

      const user = await models.user.findOne({
        where: {
          email: 'normal',
        }
      });

      return assert.becomes(utils.can(models, redis, user.id, 'reservation', 'update'), false);
    });
  });

  describe('#cannot', () => {
    it('should return true if deny permission is included', () => {

    });

    it('should return false if deny permission is not included', () => {

    });

    it('should deny access to own user record with owner deny permission', () => {
      const models = app.get('sequelize').models;
      const redis = app.get('redis');

      return models.user.findOne({
        where: {
          email: 'ownerdeny',
        },
      }).then((data) => {
        const user = JSON.parse(JSON.stringify(data));

        return assert.becomes(utils.cannot(models, redis, user.id, 'user:update', 'user', user.id), true);
      }).catch((err) => {
        assert.fail();
      });
    });

    it('should deny access to own user record with deny property permission', () => {
      const models = app.get('sequelize').models;
      const redis = app.get('redis');

      return models.user.findOne({
        where: {
          email: 'ownerdenyproperty',
        },
      }).then((data) => {
        const user = JSON.parse(JSON.stringify(data));

        return assert.becomes(utils.cannot(models, redis, user.id, 'user:roles:update', 'user', user.id), true);
      }).catch((err) => {
        assert.fail();
      });
    });

    it('should not deny access to other user record with owner deny permission', () => {
      const models = app.get('sequelize').models;
      const redis = app.get('redis');

      return models.user.findOne({
        where: {
          email: 'ownerdeny',
        },
      }).then((data) => {
        const user = JSON.parse(JSON.stringify(data));

        return models.user.findOne({
          where: {
            email: 'admin',
          },
        }).then((result) => {
          const otherUser = JSON.parse(JSON.stringify(result));

          return assert.becomes(utils.cannot(models, redis, user.id, 'user:update', 'user', otherUser.id), false);
        });
      }).catch((err) => {
        assert.fail();
      });
    });

    it('should not deny access to other user record with owner deny property permission', () => {
      const models = app.get('sequelize').models;
      const redis = app.get('redis');

      return models.user.findOne({
        where: {
          email: 'ownerdenyproperty',
        },
      }).then((data) => {
        const user = JSON.parse(JSON.stringify(data));

        return models.user.findOne({
          where: {
            email: 'admin',
          },
        }).then((result) => {
          const otherUser = JSON.parse(JSON.stringify(result));

          return assert.becomes(utils.cannot(models, redis, user.id, 'user:roles:update', 'user', otherUser.id), false);
        });
      }).catch((err) => {
        assert.fail();
      });
    });

    it('should deny access to own record with deny permission', async () => {
      const models = app.get('sequelize').models;
      const redis = app.get('redis');

      const user = await models.user.findOne({
        where: {
          email: 'ownerdenyreservation',
        },
      });

      const reservation = await models.reservation.findOne({
        where: {
          notes: 'VIDEO_SHOOT3',
        },
      });

      return assert.becomes(utils.cannot(models, redis, user.id, 'reservation:update', 'reservation', reservation.id), true);
    });

    it('should deny access to own record with deny property permission', async () => {
      const models = app.get('sequelize').models;
      const redis = app.get('redis');

      const user = await models.user.findOne({
        where: {
          email: 'ownerdenyreservationproperty',
        },
      });

      const reservation = await models.reservation.findOne({
        where: {
          notes: 'VIDEO_SHOOT4',
        },
      });

      return assert.becomes(utils.cannot(models, redis, user.id, 'reservation:approved:update', 'reservation', reservation.id), true);
    });

    it.skip('should not deny access to other record with deny permission', async () => {
      const models = app.get('sequelize').models;
      const redis = app.get('redis');

      const user = await models.user.findOne({
        where: {
          email: 'ownerdenyreservation',
        },
      });

      const reservation = await models.reservation.findOne({
        where: {
          notes: 'VIDEO_SHOOT',
        },
      });

      return assert.becomes(utils.cannot(models, redis, user.id, 'reservation:update', 'reservation', reservation.id), false);
    });

    it.skip('should not deny access to other record with deny property permission', async () => {
      const models = app.get('sequelize').models;
      const redis = app.get('redis');

      const user = await models.user.findOne({
        where: {
          email: 'ownerdenyreservationproperty',
        },
      });

      const reservation = await models.reservation.findOne({
        where: {
          notes: 'VIDEO_SHOOT',
        },
      });

      return assert.becomes(utils.cannot(models, redis, user.id, 'reservation:approved:update', 'reservation', reservation.id), true);
    });

    it('should handle overlap by making deny flag take precedence', () => {
      
    });
  });

  describe('#includesPermission', () => {
    it('should return true if permission is included', () => {

    });

    it('should return false if permission is not included', () => {

    });

    it('should return true if owner permission is included and user owns record', () => {

    });

    it('should return false if only owner permission is included and user does not own record', () => {

    });
  });

  describe('#convertToPermission', () => {
    it('should return the correct permission', () => {
      const result = utils.convertToPermission('reservation', 'update');

      assert.equal(result, 'reservation:update');
    });
    
    it('should return the correct permission', () => {
      const result = utils.convertToPermission('reservation', 'find');

      assert.equal(result, 'reservation:read');
    });

    it('should return the correct permission', () => {
      const result = utils.convertToPermission('reservation', 'get');

      assert.equal(result, 'reservation:read');
    });
  });

  describe('#is', () => {
    it('should not implicitly return true for master', () => {

    });
  });

  describe('#resolve', () => {
    it('should resolve roles', async () => {
      const models = app.get('sequelize').models;
      const redis = app.get('redis');

      const user = await models.user.findOne({ where: { email: 'admin' } });

      const expected = 'device:read, device:update, reservation:create, reservation:read, reservation:delete, reservation:update, reservation:approve, roomReservation:create, roomReservation:read, roomReservation:delete, roomReservation:update, roomReservation:approve, user:update, deny!user:roles:update, deny!user:disabled:update, deny!user:doNotDisturb:update, user:view-disabled';
      const array = ['admin'];

      array.push(...expected.split(', '));

      return assert.becomes(utils.resolve(models, redis, user.id), array);
    });

    it('should handle user with no roles', async () => {
      const models = app.get('sequelize').models;
      const redis = app.get('redis');

      const user = await models.user.findOne({ where: { email: 'normal' } });

      const expected = [];

      return assert.becomes(utils.resolve(models, redis, user.id), expected);
    });

    it('should handle roles not in database', async () => {
      const models = app.get('sequelize').models;
      const redis = app.get('redis');

      const user = await models.user.findOne({ where: { email: 'nondatabase' } });

      const expected = ['not-database-role'];

      return assert.becomes(utils.resolve(models, redis, user.id), expected);
    });
  });

  describe('#populateRoles', () => {
    it('should handle roles that are not in database', async () => {
      const models = app.get('sequelize').models;
      const redis = app.get('redis');

      const user = await models.user.findOne({ where: { email: 'admin' } });

      return assert.becomes(utils.populateRoles(models, redis, 'non-database-role', user.id), []);
    });
  });

  describe('#populateRole', async () => {
    it('should replace a single role with corresponding permission', async () => {
      const models = app.get('sequelize').models;
      const redis = app.get('redis');

      const user = await models.user.findOne({ where: { email: 'admin' } });

      return models.role.findOne({
        where: {
          name: 'admin',
        },
      }).then((data) => {
        const role = JSON.parse(JSON.stringify(data));

        return assert.becomes(utils.populateRole(models, redis, 'admin', user.id), role.permissions.split(', '));
      }).catch((err) => {
        assert.fail();
      });
    });

    it('should replace all roles with corresponding permissions', async () => {
      const models = app.get('sequelize').models;
      const redis = app.get('redis');

      const user = await models.user.findOne({ where: { email: 'admin' } });

      return models.role.findOne({
        where: {
          name: 'admin',
        },
      }).then((data) => {
        const role = JSON.parse(JSON.stringify(data));

        return utils.populateRole(models, redis, 'admin, advisor', user.id)
          .then((result) => {
            return _.includes(result, 'user:delete');
          });
      }).catch((err) => {
        assert.fail();
      });
    });

    it('should handle roles that are not in database', async () => {
      const models = app.get('sequelize').models;
      const redis = app.get('redis');

      const user = await models.user.findOne({ where: { email: 'admin' } });

      return assert.becomes(utils.populateRole(models, redis, 'non-database-role', user.id), []);
    });

    it('should support roles with empty permissions property', () => {

    });
  });

  describe('#getRole', () => {
    it('should get permissions from corresponding role', () => {

    });

    it('should not throw error for non-existent role', () => {
      
    })
  });

  describe('#retrieveRole', () => {
    it('should retrieve role from database', async () => {
      const models = app.get('sequelize').models;
      const redis = app.get('redis');

      const user = await models.user.findOne({ where: { email: 'admin' } });

      return assert.isFulfilled(utils.retrieveRole(models, redis, 'admin', user.id));
    });
  });

  describe('#getUserRoles', () => {
    it('should return user roles', () => {
      const models = app.get('sequelize').models;

      return models.user.findOne({
        where: {
          email: 'approve',
        },
      }).then((data) => {
        const user = JSON.parse(JSON.stringify(data));

        return assert.becomes(utils.getUserRoles(app.get('sequelize').models, user.id), 'admin, reservation:approve');
      }).catch((err) => {
        assert.fail();
      });
    });

    it('should handle default roles', async () => {
      const models = app.get('sequelize').models;
      const redis = app.get('redis');

      const user = await models.user.findOne({ where: { email: 'radiouser' } });

      return assert.becomes(utils.getUserRoles(models, user.id), 'roomReservation:create');
    });

    it('should not return default roles if user has roles', async () => {
      const models = app.get('sequelize').models;
      const redis = app.get('redis');

      const user = await models.user.findOne({ where: { email: 'radioadmin' } });

      return assert.becomes(utils.getUserRoles(models, user.id), 'reservation:update, roomReservation:update');
    });
  });

  describe('#isRole', () => {
    it('should return true for a role', () => {
      const result = utils.isRole('admin');

      assert.equal(result, true);
    });
    it('should return false for a standard role', () => {
      const result = utils.isRole('reservation:read');

      assert.equal(result, false);
    });
    it('should return false for a property role', () => {
      const result = utils.isRole('reservation:purpose:update');

      assert.equal(result, false);
    });
    it('should return false for a custom role', () => {
      const result = utils.isRole('reservation:approve');

      assert.equal(result, false);
    });
  });

  describe('#isPermission', () => {
    it('should return true for a standard role', () => {
      const result = utils.isPermission('reservation:read');

      assert.equal(result, true);
    });
    it('should return false for a property role', () => {
      const result = utils.isPermission('reservation:purpose:update');

      assert.equal(result, false);
    });
    it('should return false for a custom role', () => {
      const result = utils.isPermission('reservation:approve');

      assert.equal(result, false);
    });
  });

  describe('#isPropertyPermission', () => {
    it('should return true for a property permission', () => {
      const result = utils.isPropertyPermission('reservation:purpose:update');

      assert.equal(result, true);
    });
    it('should return false for standard permission', () => {
      const result = utils.isPropertyPermission('reservation:create');

      assert.equal(result, false);
    });
    it('should return false for custom permission', () => {
      const result = utils.isPropertyPermission('reservation:approve');

      assert.equal(result, false);
    });
  });

  describe('#isCustomPermission', () => {
    it('should return true for custom permission', () => {
      const result = utils.isCustomPermission('reservation:approve');

      assert.equal(result, true);
    });
    it('should return false for standard permission', () => {
      const result = utils.isCustomPermission('reservation:create');

      assert.equal(result, false);
    });
    it('should return false for property permission', () => {
      const result = utils.isCustomPermission('reservation:purpose:update');

      assert.equal(result, false);
    });
  });

  describe('#isCRUDAction', () => {
    it('should return true for create', () => {
      const result = utils.isCRUDAction('create');

      assert.equal(result, true);
    });
    it('should return true for read', () => {
      const result = utils.isCRUDAction('read');

      assert.equal(result, true);
    });
    it('should return true for update', () => {
      const result = utils.isCRUDAction('update');

      assert.equal(result, true);
    });
    it('should return true for delete', () => {
      const result = utils.isCRUDAction('delete');

      assert.equal(result, true);
    });
    it('should return false for non-CRUD actions', () => {
      const result = utils.isCRUDAction('not-a-crud-action');

      assert.equal(result, false);
    });
  });

  describe('#convertToCRUD', () => {
    it('should convert find', () => {
      const action = utils.convertToCRUD('find');

      assert.equal(action, 'read');
    });
    it('should convert get', () => {
      const action = utils.convertToCRUD('get');

      assert.equal(action, 'read');
    });
    it('should convert create', () => {
      const action = utils.convertToCRUD('create');

      assert.equal(action, 'create');
    });
    it('should convert update', () => {
      const action = utils.convertToCRUD('update');

      assert.equal(action, 'update');
    });
    it('should convert patch', () => {
      const action = utils.convertToCRUD('patch');

      assert.equal(action, 'update');
    });
    it('should convert remove', () => {
      const action = utils.convertToCRUD('remove');

      assert.equal(action, 'delete');
    });
  });

  describe('#split', () => {
    it('should split standard roles', () => {
      const role = 'reservation:read';
      const values = utils.split(role);

      return assert.deepEqual(values, ['reservation', 'read']);
    });
    it('should split property roles', () => {
      const role = 'reservation:purpose:read';
      const values = utils.split(role);

      return assert.deepEqual(values, ['reservation', 'purpose', 'read']);
    });
  });
});
