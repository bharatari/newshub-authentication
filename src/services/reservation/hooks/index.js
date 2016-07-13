'use strict';

const globalHooks = require('../../../hooks');
const hooks = require('feathers-hooks');
const auth = require('feathers-authentication').hooks;
const associate = require('./associate');
const populate = require('./populate');
const process = require('./process');

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
  update: [],
  patch: [],
  remove: []
};

exports.after = {
  all: [],
  find: [],
  get: [],
  create: [
    associate(),
  ],
  update: [],
  patch: [],
  remove: []
};
