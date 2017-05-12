'use strict';

// organization-model.js - A sequelize model
// 
// See http://docs.sequelizejs.com/en/latest/docs/models-definition/
// for more of what you can do here.

const Sequelize = require('sequelize');

module.exports = function(sequelize) {
  const organization = sequelize.define('organization', {
    name: {
      type: Sequelize.STRING,
      allowNull: false
    },
    label: {
      type: Sequelize.STRING,
      allowNull: false
    }
  }, {
    freezeTableName: true,
    classMethods: {
      associate(models) {
        organization.belongsToMany(models.user);
      },
    },
  });  

  return organization;
};
