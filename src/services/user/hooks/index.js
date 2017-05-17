'use strict';

const globalHooks = require('../../../hooks');
const hooks = require('feathers-hooks');
const auth = require('feathers-authentication').hooks;
const token = require('./token');
const master = require('./master');
const normalize = require('./normalize');
const sanitize = require('./sanitize');
const associate = require('./associate');

exports.before = {
  all: [],
  find: [
    auth.verifyToken(),
    auth.populateUser(),
    auth.restrictToAuthenticated(),
    sanitize(),
  ],
  get: [
    auth.verifyToken(),
    auth.populateUser(),
    auth.restrictToAuthenticated(),
  ],
  create: [
    normalize(),
    auth.hashPassword(),
    token(),
  ],
  update: [
    hooks.disable(),
  ],
  patch: [
    auth.verifyToken(),
    auth.populateUser(),
    auth.restrictToAuthenticated(),
    master(),
  ],
  remove: [
    hooks.disable(),
  ],
};

exports.after = {
  all: [hooks.remove('password')],
  find: [],
  get: [],
  create: [
    associate(),
  ],
  update: [],
  patch: [],
  remove: [],
};
