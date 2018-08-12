'use strict';

const assert = require('assert');
const app = require('../../../src/app');

describe('organization service', function() {
  it('registered the organization service', () => {
    assert.ok(app.service('/api/organization'));
  });
});
