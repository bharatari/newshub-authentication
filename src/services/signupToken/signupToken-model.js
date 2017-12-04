'use strict';

// signupToken-model.js - A sequelize model
//
// See http://docs.sequelizejs.com/en/latest/docs/models-definition/
// for more of what you can do here.

const Sequelize = require('sequelize');

module.exports = function (sequelize) {
  const signupToken = sequelize.define('signupToken', {
    token: {
      type: Sequelize.TEXT,
      allowNull: false,
    },
    expires: {
      type: Sequelize.DATE,
      allowNull: false,
    },
    hasBeenUsed: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    },
  }, {
    freezeTableName: true,
    classMethods: {
      
    },
  });

  signupToken.associate = function (models) {
    signupToken.belongsTo(models.organization);
  };

  return signupToken;
};
