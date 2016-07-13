'use strict';

// user-model.js - A sequelize model
// 
// See http://docs.sequelizejs.com/en/latest/docs/models-definition/
// for more of what you can do here.

const Sequelize = require('sequelize');

module.exports = function(sequelize) {
  const user = sequelize.define('user', {
    firstName: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    lastName: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    email: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
    },
    username: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    title: {
      type: Sequelize.STRING,
    },
    notes: {
      type: Sequelize.STRING,
    },
    roles: {
      type: Sequelize.STRING,
    },
    disabled: {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: false,
    },
  }, {
    freezeTableName: true,
    getterMethods: {
      fullName() {
        return this.firstName + ' ' + this.lastName;
      },
    },
  });

  return user;
};
