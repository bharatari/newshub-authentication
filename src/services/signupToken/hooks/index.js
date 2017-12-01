'use strict';

const globalHooks = require('../../../hooks');
const auth = require('@feathersjs/authentication').hooks;
const hooks = require('feathers-common-hooks');
const create = require('./create');
const access = require('./access');

exports.before = {
  all: [
    auth.authenticate('jwt'),
  ],
  find: [
    hooks.disallow(),
  ],
  get: [
    hooks.disallow(),
  ],
  create: [
    access(),
    create(),
  ],
  update: [
    hooks.disallow(),
  ],
  patch: [
    hooks.disallow(),
  ],
  remove: [],
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
