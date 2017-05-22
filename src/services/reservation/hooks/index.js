'use strict';

const globalHooks = require('../../../hooks');
const hooks = require('feathers-hooks');
const auth = require('feathers-authentication').hooks;
const associate = require('./associate');
const populate = require('./populate');
const process = require('./process');
const filter = require('./filter');
const status = require('./status');
const email = require('./email');
const validate = require('./validate');
const remove = require('./remove');
const restrict = require('./restrict');
const count = require('./count');

exports.before = {
  all: [
    auth.verifyToken(),
    auth.populateUser(),
    auth.restrictToAuthenticated(),
    globalHooks.protectOrganization({ model: 'reservation' }),
    globalHooks.restrictChangeOrganization({ model: 'reservation' }),
  ],
  find: [
    validate(),
    filter(),
    populate(),
  ],
  get: [
    populate(),
  ],
  create: [
    process(),
    validate(),
    restrict(),
  ],
  update: [
    hooks.disable(),
  ],
  patch: [
    status(),
  ],
  remove: [
    remove(),
  ],
};

exports.after = {
  all: [],
  find: [
    count(),
  ],
  get: [],
  create: [
    associate(),
    email(),
  ],
  update: [],
  patch: [],
  remove: [],
};
