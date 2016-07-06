'use strict';

const assert = require('assert');
const app = require('../../../src/app');

describe('user service', function() {
  it('registered the user service', () => {
    assert.ok(app.service('/api/user'));
  });
});
