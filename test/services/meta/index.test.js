'use strict';

const assert = require('assert');
const app = require('../../../src/app');

describe('meta service', function() {
  it('registered the meta service', () => {
    assert.ok(app.service('/api/meta'));
  });
});
