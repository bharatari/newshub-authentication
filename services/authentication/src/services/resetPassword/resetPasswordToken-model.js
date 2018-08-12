'use strict';

// resetPasswordToken-model.js - A sequelize model
//
// See http://docs.sequelizejs.com/en/latest/docs/models-definition/
// for more of what you can do here.

const Sequelize = require('sequelize');

module.exports = function (sequelize) {
  const resetPasswordToken = sequelize.define('resetPasswordToken', {
    token: {
      type: Sequelize.TEXT,
      allowNull: false,
    },
    expires: {
      type: Sequelize.DATE,
      allowNull: false,
    },
    used: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    },
    email: {
      type: Sequelize.TEXT,
      allowNull: false,
    },
  }, {
    freezeTableName: true,
  });

  resetPasswordToken.associate = function (models) {
    resetPasswordToken.belongsTo(models.user);
    resetPasswordToken.belongsTo(models.organization);
  };

  return resetPasswordToken;
};
