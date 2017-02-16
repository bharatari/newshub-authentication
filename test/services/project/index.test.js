'use strict';

const assert = require('assert');
const app = require('../../../src/app');

describe('project service', () => {
  it('registered the project service', () => {
    assert.ok(app.service('/api/project'));
  });
});
