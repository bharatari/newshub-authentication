'use strict';

const assert = require('assert');
const app = require('../../../src/app');

describe('reservation service', function() {
  it('registered the reservation service', () => {
    assert.ok(app.service('/api/reservation'));
  });
});
