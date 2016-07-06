'use strict';

// device-model.js - A sequelize model
// 
// See http://docs.sequelizejs.com/en/latest/docs/models-definition/
// for more of what you can do here.

const Sequelize = require('sequelize');

module.exports = function(sequelize) {
  const device = sequelize.define('device', {
    name: {
      type: Sequelize.STRING,
      unique: true,
    },
    label: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    description: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    notes: {
      type: Sequelize.STRING,
    },
    type: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    quantity: {
      type: Sequelize.INTEGER,
      allowNull: false,
    }
  }, {
    freezeTableName: true,
    classMethods: {
      associate(models) {
        device.belongsToMany(models.reservation, { through: 'reservation_devices' });
      },
    },
  });

  return device;
};
