/* eslint-env node, mocha */
/* eslint prefer-arrow-callback: 0 */

'use strict';

const assert = require('chai').assert;
const app = require('../../src/app');
const utils = require('../../src/utils/roles');

describe('roles utils', () => {
  describe('#can', () => {
    it('should return true for properly authorized user', () => {
      const models = app.get('sequelize').models;
      const redis = app.get('redis');

      return models.user.findOne({
        where: {
          username: 'device',
        },
      }).then((data) => {
        const user = JSON.parse(JSON.stringify(data));

        return assert.becomes(utils.can(models, redis, user.id, 'device', 'create'), true);
      }).catch((err) => {
        assert.fail();
      });
    });
  });
  describe('#convertToPermission', () => {
    it('should return the correct permission', () => {
      const result = utils.convertToPermission('reservation', 'update');

      assert.equal(result, 'reservation:update');
    });
  });
  describe('#populateRoles', () => {
    it('should replace all roles with corresponding roles', () => {

    });
  });
  describe('#populateRole', () => {
    it('should replace role with corresponding roles', () => {

    });
  });
  describe('#getRole', () => {
    it('should get roles from corresponding role', () => {

    });
  });
  describe('#retrieveRole', () => {
    it('should retrieve role from database', () => {
      const models = app.get('sequelize').models;
      const redis = app.get('redis');

      return assert.isFulfilled(utils.retrieveRole(models, redis, 'admin'));
    });
  });
  describe('#getPermissions', () => {
    it('should return user roles', () => {
      const models = app.get('sequelize').models;

      return models.user.findOne({
        where: {
          username: 'approve',
        },
      }).then((data) => {
        const user = JSON.parse(JSON.stringify(data));

        return assert.becomes(utils.getUserRoles(app.get('sequelize').models, user.id), 'admin, reservation:approve');
      }).catch((err) => {
        console.log(err);
        assert.fail();
      });
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
