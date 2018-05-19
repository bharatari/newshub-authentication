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
    password: {
      type: Sequelize.TEXT,
      allowNull: false,
    },
    disabled: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  }, {
    freezeTableName: true,
    getterMethods: {
      fullName() {
        return `${this.firstName} ${this.lastName}`;
      },
    },
  });

  user.associate = function (models) {
    user.belongsToMany(models.organization, {
      through: modelUtils.organizationUsers(sequelize),
    });
    user.belongsTo(models.organization, { as: 'currentOrganization' });
  };

  return user;
};
