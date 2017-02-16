'use strict';

const assert = require('assert');
const app = require('../../../src/app');

describe('signupToken service', () => {
  it('registered the signupToken service', () => {
    assert.ok(app.service('/api/signup-token'));
  });
});
