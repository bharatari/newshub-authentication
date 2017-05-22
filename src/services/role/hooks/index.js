'use strict';

const globalHooks = require('../../../hooks');
const hooks = require('feathers-hooks');
const auth = require('feathers-authentication').hooks;
const process = require('./process');
const clean = require('./clean');

exports.before = {
  all: [
    auth.verifyToken(),
    auth.populateUser(),
    auth.restrictToAuthenticated(),
    globalHooks.protectOrganization({ model: 'role' }),
    globalHooks.restrictChangeOrganization({ model: 'role'}),
  ],
  find: [
    clean(),
  ],
  get: [
    hooks.disable(),
  ],
  create: [
    hooks.disable(),
  ],
  update: [
    hooks.disable(),
  ],
  patch: [
    hooks.disable(),
  ],
  remove: [
    hooks.disable(),
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
