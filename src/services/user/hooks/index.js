'use strict';

const globalHooks = require('../../../hooks');
const auth = require('@feathersjs/authentication').hooks;
const local = require('feathers-authentication-local').hooks;
const hooks = require('feathers-hooks-common');
const token = require('./token');
const master = require('./master');
const normalize = require('./normalize');
const sanitize = require('./sanitize');
const associate = require('./associate');
const populate = require('./populate');
const organization = require('./organization');
const result = require('./result');

exports.before = {
  all: [],
  find: [
    auth.authenticate('jwt'),
    globalHooks.protectOrganization({ model: 'user', belongsToMany: true }),
    populate(),
    sanitize(),
  ],
  get: [
    auth.authenticate('jwt'),
    globalHooks.protectOrganization({ model: 'user', belongsToMany: true }),
    populate(),
  ],
  create: [
    normalize(),
    local.hashPassword({ passwordField: 'password' }),
    token(),
  ],
  update: [
    hooks.disallow(),
  ],
  patch: [
    auth.authenticate('jwt'),
    organization(),
    globalHooks.protectOrganization({ model: 'user', belongsToMany: true }),
    globalHooks.restrictChangeOrganization({ model: 'user', belongsToMany: true }),
    master(),
  ],
  remove: [
    hooks.disallow(),
  ],
};

exports.after = {
  all: [local.protect('password')],
  find: [],
  get: [],
  create: [
    associate(),
  ],
  update: [],
  patch: [
    result(),
  ],
  remove: [],
};
