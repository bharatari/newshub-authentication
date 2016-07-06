'use strict';

const assert = require('assert');
const app = require('../../../src/app');

describe('device service', function() {
  it('registered the device service', () => {
    assert.ok(app.service('/api/device'));
  });
});
