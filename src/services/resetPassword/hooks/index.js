'use strict';

const globalHooks = require('../../../hooks');
const hooks = require('feathers-hooks');
const auth = require('feathers-authentication').hooks;
const create = require('./create');
const validate = require('./validate');
const sanitize = require('./sanitize');
const store = require('./store');

exports.before = {
  all: [],
  find: [
    hooks.disable(),
  ],
  get: [
    hooks.disable(),
  ],
  create: [
    create(),
  ],
  update: [
    hooks.disable(),
  ],
  patch: [
    validate(),
    auth.hashPassword(),
    store(),
  ],
  remove: [
    hooks.disable(),
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
