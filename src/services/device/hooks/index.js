'use strict';

const globalHooks = require('../../../hooks');
const auth = require('@feathersjs/authentication').hooks;
const quantity = require('./quantity');
const populate = require('./populate');
const create = require('./create');

exports.before = {
  all: [
    auth.verifyToken(),
    auth.populateUser(),
    auth.restrictToAuthenticated(),
    globalHooks.protectOrganization({ model: 'device' }),
    globalHooks.restrictChangeOrganization({ model: 'device' }),
  ],
  find: [
    populate(),
    quantity(),
  ],
  get: [
    populate(),
  ],
  create: [
    create(),
    globalHooks.checkAccess({ service: 'device' }),
    globalHooks.addToOrganization(),
  ],
  update: [],
  patch: [],
  remove: [],
};

exports.after = {
  all: [],
  find: [
    quantity(),
  ],
  get: [],
  create: [],
  update: [],
  patch: [],
  remove: [],
};
