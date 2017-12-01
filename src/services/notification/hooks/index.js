'use strict';

const globalHooks = require('../../../hooks');
const auth = require('@feathersjs/authentication').hooks;

exports.before = {
  all: [
    auth.authenticate('jwt'),
    globalHooks.protectOrganization({ model: 'notification' }),
    globalHooks.restrictChangeOrganization({ model: 'notification' }),
  ],
  find: [],
  get: [],
  create: [],
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
