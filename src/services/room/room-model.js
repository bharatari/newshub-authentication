'use strict';

// room-model.js - A sequelize model
// 
// See http://docs.sequelizejs.com/en/latest/docs/models-definition/
// for more of what you can do here.

const Sequelize = require('sequelize');
const modelUtils = require('../../utils/models');

module.exports = function(sequelize) {
  const room = sequelize.define('room', {
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
    disabled: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  }, {
    freezeTableName: true,
    classMethods: {
      associate(models) {
        room.belongsTo(models.building);
        room.belongsToMany(models.organization, {
          through: modelUtils.organizationRoom(sequelize),
        });
      },
    },
  });

  return room;
};
