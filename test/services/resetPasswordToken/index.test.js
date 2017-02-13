'use strict';

const assert = require('assert');
const app = require('../../../src/app');

describe('resetPassword service', function() {
  it('registered the resetPassword service', () => {
    assert.ok(app.service('/api/reset-password'));
  });
});
