/* eslint-env node, mocha */
/* eslint prefer-arrow-callback: 0 */

'use strict';

const assert = require('chai').assert;
const app = require('../../src/app');
const utils = require('../../src/utils/models');
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const _ = require('lodash');

describe('models utils', () => {
  before((done) => {
    chai.use(chaiAsPromised);

    done();
  });

  describe('#mergeQuery', () => {
    it('should handle existing values', () => {
      const query = {
        where: {
          id: 1,
        },
        include: [{
          model: 'user',
        }],
      };

      const include = [{
        model: 'organization',
      }];
      
      const where = {
        name: 'Zoom',
      };

      const expected = {
        where: {
          id: 1,
          name: 'Zoom',
        },
        include: [{
          model: 'user',
        }, {
          model: 'organization',
        }],
      };

      assert.deepEqual(utils.mergeQuery(query, where, include), expected);
    });

    it('should handle empty query', () => {
      const query = {};

      const include = [{
        model: 'organization',
      }];
      
      const where = {
        name: 'Zoom',
      };

      const expected = {
        where: {
          name: 'Zoom',
        },
        include: [{
          model: 'organization',
        }],
      };

      assert.deepEqual(utils.mergeQuery(query, where, include), expected);
    });

    it('should handle null query', () => {
      const query = null;

      const include = [{
        model: 'organization',
      }];
      
      const where = {
        name: 'Zoom',
      };

      const expected = {
        where: {
          name: 'Zoom',
        },
        include: [{
          model: 'organization',
        }]
      };

      assert.deepEqual(utils.mergeQuery(query, where, include), expected);
    });

    it('should handle null query with only where provided', () => {
      const query = null;

      const where = {
        name: 'Zoom',
      };

      const expected = {
        where: {
          name: 'Zoom',
        },
      };

      assert.deepEqual(utils.mergeQuery(query, where, null), expected);
    });
    
    it('should handle null query with only include provided', () => {
      const query = null;

      const include = [{
        model: 'organization',
      }];

      const expected = {
        include: [{
          model: 'organization',
        }],
      };

      assert.deepEqual(utils.mergeQuery(query, null, include), expected);
    });
  });
});
