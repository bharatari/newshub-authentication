'use strict';

// rolePreset-model.js - A sequelize model
// 
// See http://docs.sequelizejs.com/en/latest/docs/models-definition/
// for more of what you can do here.

const Sequelize = require('sequelize');

module.exports = function(sequelize) {
  const rolePreset = sequelize.define('rolePreset', {
    name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    roles: {
      type: Sequelize.STRING,
      allowNull: false,
    },
  }, {
    freezeTableName: true
  });

  return rolePreset;
};
