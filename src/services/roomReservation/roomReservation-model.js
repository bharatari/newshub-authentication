'use strict';

// roomReservation-model.js - A sequelize model
//
// See http://docs.sequelizejs.com/en/latest/docs/models-definition/
// for more of what you can do here.

const Sequelize = require('sequelize');
const modelUtils = require('../../utils/models');

module.exports = function (sequelize) {
  const roomReservation = sequelize.define('roomReservation', {
    purpose: {
      type: Sequelize.TEXT,
      allowNull: false,
    },
    notes: {
      type: Sequelize.TEXT,
    },
    specialRequests: {
      type: Sequelize.TEXT,
    },
    adminNotes: {
      type: Sequelize.TEXT,
    },
    startDate: {
      type: Sequelize.DATE,
      allowNull: false,
    },
    endDate: {
      type: Sequelize.DATE,
      allowNull: false,
    },
    meta: {
      type: Sequelize.JSON,
    },
    approved: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
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
        roomReservation.belongsTo(models.room);
        roomReservation.belongsTo(models.user, { as: 'approvedBy' });
        roomReservation.belongsTo(models.user, { as: 'disabledBy' });
        roomReservation.belongsTo(models.user);
        roomReservation.belongsTo(models.organization);
      },
    },
  });

  return roomReservation;
};
