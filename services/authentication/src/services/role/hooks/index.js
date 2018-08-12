'use strict';

const globalHooks = require('../../../hooks');
const auth = require('@feathersjs/authentication').hooks;
const hooks = require('feathers-hooks-common');
const process = require('./process');
const clean = require('./clean');

exports.before = {
  all: [
    auth.authenticate('jwt'),
  ],
  find: [
    clean(),
  ],
  get: [
    hooks.disallow(),
  ],
  create: [
    hooks.disallow(),
  ],
  update: [
    hooks.disallow(),
  ],
  patch: [
    hooks.disallow(),
  ],
  remove: [
    hooks.disallow(),
  ],
};

exports.after = {
  all: [],
  find: [
    process(),
  ],
  get: [],
  create: [],
  update: [],
  patch: [],
  remove: [],
};
