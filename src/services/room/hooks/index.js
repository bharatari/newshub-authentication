'use strict';

const globalHooks = require('../../../hooks');
const auth = require('@feathersjs/authentication').hooks;
const populate = require('./populate');
const create = require('./create');

exports.before = {
  all: [
    auth.authenticate('jwt'),
    globalHooks.protectOrganization({ model: 'room' }),
    globalHooks.restrictChangeOrganization({ model: 'room' }),
  ],
  find: [
    populate(),
  ],
  get: [
    populate(),
  ],
  create: [
    create(),
    globalHooks.addToOrganization(),
  ],
  update: [],
  patch: [],
  remove: []
};

exports.after = {
  all: [],
  find: [],
  get: [],
  create: [],
  update: [],
  patch: [],
  remove: []
};
