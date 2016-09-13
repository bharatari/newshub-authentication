'use strict';

const globalHooks = require('../../../hooks');
const hooks = require('feathers-hooks');
const auth = require('feathers-authentication').hooks;
const disabled = require('./disabled');
const normalize = require('./normalize');

exports.before = {
  all: [],
  find: [],
  get: [],
  create: [
    normalize(),
    disabled(),
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
