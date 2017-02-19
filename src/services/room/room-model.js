'use strict';

// room-model.js - A sequelize model
// 
// See http://docs.sequelizejs.com/en/latest/docs/models-definition/
// for more of what you can do here.

const Sequelize = require('sequelize');

module.exports = function(sequelize) {
  const room = sequelize.define('rooms', {
    name: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
    },
    label: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    description: {
      type: Sequelize.STRING,
    },
    capacity: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    meta: {
      type: Sequelize.JSONB,
      allowNull: false,
      defaultValue: {},
    },
  }, {
    freezeTableName: true,
    classMethods: {
      associate(models) {
        room.belongsTo(models.building);
      },
    },
  });

  return room;
};
