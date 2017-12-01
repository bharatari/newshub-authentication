'use strict';

const globalHooks = require('../../../hooks');
const auth = require('@feathersjs/authentication').hooks;
const hooks = require('feathers-common-hooks');
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
const specialApproval = require('./specialApproval');

exports.before = {
  all: [
    auth.authenticate('jwt'),
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
    specialApproval(),
    globalHooks.addToOrganization(),
  ],
  update: [
    hooks.disallow(),
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
