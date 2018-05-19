'use strict';

const organization = require('./organization');
const resetPassword = require('./resetPassword');
const role = require('./role');
const image = require('./image');
const signupToken = require('./signupToken');
const user = require('./user');
const Sequelize = require('sequelize');

module.exports = function (app) {
  app.configure(user);
  app.configure(signupToken);
  app.configure(image);
  app.configure(role);
  app.configure(resetPassword);
  app.configure(organization);
};
