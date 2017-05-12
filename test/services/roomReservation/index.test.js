'use strict';

const assert = require('assert');
const app = require('../../../src/app');

describe('roomReservation service', function() {
  it('registered the roomReservations service', () => {
    assert.ok(app.service('/api/room-reservation'));
  });
});
