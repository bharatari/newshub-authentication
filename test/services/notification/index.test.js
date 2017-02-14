'use strict';

const assert = require('assert');
const app = require('../../../src/app');

describe('notification service', () => {
  it('registered the notification service', () => {
    assert.ok(app.service('/api/notification'));
  });
});
