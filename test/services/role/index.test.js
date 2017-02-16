'use strict';

const assert = require('assert');
const app = require('../../../src/app');

describe('role service', () => {
  it('registered the role service', () => {
    assert.ok(app.service('/api/role'));
  });
});
