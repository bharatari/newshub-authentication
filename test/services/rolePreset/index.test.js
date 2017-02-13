'use strict';

const assert = require('assert');
const app = require('../../../src/app');

describe('rolePreset service', function() {
  it('registered the rolePreset service', () => {
    assert.ok(app.service('/api/role-preset'));
  });
});
