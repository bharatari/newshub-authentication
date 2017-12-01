'use strict';

const globalHooks = require('../../../hooks');
const auth = require('@feathersjs/authentication').hooks;
const hooks = require('feathers-hooks-common');

exports.before = {
  all: [
    auth.authenticate('jwt'),
  ],
  find: [],
  get: [],
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
  find: [],
  get: [],
  create: [],
  update: [],
  patch: [],
  remove: [],
};
