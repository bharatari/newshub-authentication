'use strict';

const globalHooks = require('../../../hooks');
const hooks = require('feathers-hooks');
const auth = require('feathers-authentication').hooks;
const upload = require('./upload');
const normalize = require('./normalize');

exports.before = {
  all: [
    auth.verifyToken(),
    auth.populateUser(),
    auth.restrictToAuthenticated(),
    globalHooks.protectOrganization({ model: 'image' }),
    globalHooks.restrictChangeOrganization({ model: 'image' }),
  ],
  find: [],
  get: [],
  create: [
    upload(),
    normalize(),
    globalHooks.addToOrganization(),
  ],
  update: [],
  patch: [],
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
