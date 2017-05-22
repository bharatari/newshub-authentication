'use strict';

// building-model.js - A sequelize model
// 
// See http://docs.sequelizejs.com/en/latest/docs/models-definition/
// for more of what you can do here.

const Sequelize = require('sequelize');
const modelUtils = require('../../utils/models');

module.exports = function(sequelize) {
  const building = sequelize.define('building', {
    name: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
    },
    label: {
      type: Sequelize.STRING,
      allowNull: false,
    },
  }, {
    freezeTableName: true,
    classMethods: {
      associate(models) {
        building.belongsTo(models.organization);
      },
    },
  });

  return building;
};
