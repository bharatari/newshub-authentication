'use strict';

const assert = require('assert');
const app = require('../../../src/app');

describe('activity service', function() {
  it('registered the activity service', () => {
    assert.ok(app.service('/api/activity'));
  });
});
