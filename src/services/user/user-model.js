'use strict';

// user-model.js - A sequelize model
//
// See http://docs.sequelizejs.com/en/latest/docs/models-definition/
// for more of what you can do here.

const Sequelize = require('sequelize');
const modelUtils = require('../../utils/models');

module.exports = function (sequelize) {
  const user = sequelize.define('user', {
    firstName: {
      type: Sequelize.TEXT,
      allowNull: false,
    },
    lastName: {
      type: Sequelize.TEXT,
      allowNull: false,
    },
    email: {
      type: Sequelize.TEXT,
      allowNull: false,
      unique: true,
    },
    username: {
      type: Sequelize.TEXT,
      allowNull: false,
      unique: true,
    },
    password: {
      type: Sequelize.TEXT,
      allowNull: false,
    },
    title: {
      type: Sequelize.TEXT,
    },
    notes: {
      type: Sequelize.TEXT,
    },
    roles: {
      type: Sequelize.TEXT,
    },
    disabled: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    options: {
      type: Sequelize.JSONB,
    },
  }, {
    freezeTableName: true,
    getterMethods: {
      fullName() {
        return `${this.firstName} ${this.lastName}`;
      },
    },
    classMethods: {
      associate(models) {
        user.belongsToMany(models.organization, {
          through: modelUtils.organizationUser(sequelize),
        });
        user.belongsTo(models.organization, { as: 'currentOrganization' });
      },
    },
  });

  return user;
};
