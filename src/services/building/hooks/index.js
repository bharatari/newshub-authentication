'use strict';

const globalHooks = require('../../../hooks');
const auth = require('@feathersjs/authentication').hooks;
const create = require('./create');

exports.before = {
  all: [
    auth.authenticate('jwt'),
    globalHooks.protectOrganization({ model: 'building' }),
    globalHooks.restrictChangeOrganization({ model: 'building' }),
  ],
  find: [],
  get: [],
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
