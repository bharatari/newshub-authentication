'use strict';

const assert = require('assert');
const app = require('../../../src/app');

describe('reservation service', () => {
  it('registered the reservation service', () => {
    assert.ok(app.service('/api/reservation'));
  });

  // test proper counts
});
