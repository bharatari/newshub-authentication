'use strict';

const globalHooks = require('../../../hooks');
const hooks = require('feathers-hooks');
const auth = require('feathers-authentication').hooks;
const associate = require('./associate');
const populate = require('./populate');
const process = require('./process');
const status = require('./status');
const email = require('./email');

exports.before = {
  all: [
    auth.verifyToken(),
    auth.populateUser(),
    auth.restrictToAuthenticated()
  ],
  find: [
    populate(),
  ],
  get: [
    populate(),
  ],
  create: [
    process(),
  ],
  update: [
    hooks.disable(),
  ],
  patch: [
    status(),
  ],
  remove: []
};

exports.after = {
  all: [],
  find: [],
  get: [],
  create: [
    associate(),
    email(),
  ],
  update: [],
  patch: [],
  remove: []
};
