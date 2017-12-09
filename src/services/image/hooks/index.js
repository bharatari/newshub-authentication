'use strict';

const globalHooks = require('../../../hooks');
const auth = require('@feathersjs/authentication').hooks;
const upload = require('./upload');
const normalize = require('./normalize');

exports.before = {
  all: [
    auth.authenticate('jwt'),
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
