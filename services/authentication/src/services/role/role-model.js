'use strict';

// rolePreset-model.js - A sequelize model
//
// See http://docs.sequelizejs.com/en/latest/docs/models-definition/
// for more of what you can do here.

const Sequelize = require('sequelize');

module.exports = function (sequelize) {
  const role = sequelize.define('role', {
    name: {
      type: Sequelize.TEXT,
      allowNull: false,
    },
    permissions: {
      type: Sequelize.TEXT,
      allowNull: false,
    },
  }, {
    freezeTableName: true,
  });

  role.associate = function (models) {
    role.belongsTo(models.organization);
  };

  return role;
};
