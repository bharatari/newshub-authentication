'use strict';

const organization = require('./organization');
const resetPassword = require('./resetPassword');
const role = require('./role');
const user = require('./user');
const Sequelize = require('sequelize');

module.exports = function (app) {
  app.configure(user);
  app.configure(role);
  app.configure(resetPassword);
  app.configure(organization);
};
