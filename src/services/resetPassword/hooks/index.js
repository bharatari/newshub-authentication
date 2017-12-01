'use strict';

const globalHooks = require('../../../hooks');
const auth = require('@feathersjs/authentication').hooks;
const local = require('feathers-authentication-local').hooks;
const hooks = require('feathers-hooks-common');
const create = require('./create');
const validate = require('./validate');
const sanitize = require('./sanitize');
const store = require('./store');

exports.before = {
  all: [],
  find: [
    hooks.disallow(),
  ],
  get: [
    hooks.disallow(),
  ],
  create: [
    create(),
  ],
  update: [
    hooks.disallow(),
  ],
  patch: [
    validate(),
    auth.hashPassword({ passwordField: 'password' }),
    store(),
  ],
  remove: [
    hooks.disallow(),
  ],
};

exports.after = {
  all: [],
  find: [],
  get: [],
  create: [
    sanitize(),
  ],
  update: [],
  patch: [
    sanitize(),
  ],
  remove: [],
};
