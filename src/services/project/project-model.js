'use strict';

// project-model.js - A sequelize model
// 
// See http://docs.sequelizejs.com/en/latest/docs/models-definition/
// for more of what you can do here.

const Sequelize = require('sequelize');

module.exports = function(sequelize) {
  const project = sequelize.define('projects', {
    title: {
      type: Sequelize.STRING,
      allowNull: false
    },
    description: {
      type: Sequelize.STRING,
      allowNull: false,
    },
  }, {
    freezeTableName: true,
    classMethods: {
      associate(models) {
        project.belongsToMany(models.user, { through: 'project_participants' });
        project.belongsToMany(models.reservation, { through: 'project_reservation' });
      },
    },
  });

  return project;
};
