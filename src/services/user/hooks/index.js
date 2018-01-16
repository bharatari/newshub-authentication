'use strict';

const globalHooks = require('../../../hooks');
const auth = require('@feathersjs/authentication').hooks;
const local = require('@feathersjs/authentication-local').hooks;
const hooks = require('feathers-hooks-common');
const dehydrate = require('feathers-sequelize/hooks/dehydrate');
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
  all: [],
  find: [
    dehydrate(),
    hooks.iff(hooks.isProvider('external'), hooks.discard('password')),
  ],
  get: [
    dehydrate(),
    hooks.iff(hooks.isProvider('external'), hooks.discard('password')),
  ],
  create: [
    associate(),
    dehydrate(),
    hooks.iff(hooks.isProvider('external'), hooks.discard('password')),
  ],
  update: [
    hooks.iff(hooks.isProvider('external'), hooks.discard('password')),
  ],
  patch: [
    result(),
    dehydrate(),
    hooks.iff(hooks.isProvider('external'), hooks.discard('password')),
  ],
  remove: [
    hooks.iff(hooks.isProvider('external'), hooks.discard('password')),
  ],
};
