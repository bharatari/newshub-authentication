'use strict';

// device-model.js - A sequelize model
//
// See http://docs.sequelizejs.com/en/latest/docs/models-definition/
// for more of what you can do here.

const Sequelize = require('sequelize');
const modelUtils = require('../../utils/models');

module.exports = function (sequelize) {
  const device = sequelize.define('device', {
    name: {
      type: Sequelize.TEXT,
      unique: true,
    },
    label: {
      type: Sequelize.TEXT,
      allowNull: false,
    },
    description: {
      type: Sequelize.TEXT,
    },
    notes: {
      type: Sequelize.TEXT,
    },
    type: {
      type: Sequelize.TEXT,
      allowNull: false,
    },
    meta: {
      type: Sequelize.JSON,
    },
    quantity: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    specialApproval: {
      type: Sequelize.TEXT,
      defaultValue: null,
    },
    disabled: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  }, {
    freezeTableName: true,
  });

  device.associate = function (models) {
    device.belongsTo(models.image, { as: 'thumbnail' });
    device.belongsTo(models.organization);
    device.belongsToMany(models.reservation, {
      through: modelUtils.reservationDevices(sequelize),
    });
  };

  return device;
};
