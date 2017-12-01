'use strict';

const globalHooks = require('../../../hooks');
const auth = require('@feathersjs/authentication').hooks;
const hooks = require('feathers-common-hooks');
const populate = require('./populate');
const process = require('./process');
const filter = require('./filter');
const status = require('./status');
const email = require('./email');
const validate = require('./validate');
const remove = require('./remove');
const restrict = require('./restrict');
const count = require('./count');
const approve = require('./approve');
const available = require('./available');
const manager = require('./manager');

exports.before = {
  all: [
    auth.authenticate('jwt'),
    globalHooks.protectOrganization({ model: 'roomReservation'}),
    globalHooks.restrictChangeOrganization({ model: 'roomReservation'}),
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
    available(),
    validate(),
    restrict(),
    approve(),
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
    email(),
    manager(),
  ],
  update: [],
  patch: [],
  remove: [],
};
