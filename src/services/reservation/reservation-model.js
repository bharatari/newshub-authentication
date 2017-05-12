'use strict';

// reservation-model.js - A sequelize model
//
// See http://docs.sequelizejs.com/en/latest/docs/models-definition/
// for more of what you can do here.

const Sequelize = require('sequelize');
const modelUtils = require('../../utils/models');

module.exports = function (sequelize) {
  const reservation = sequelize.define('reservation', {
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
    checkedOut: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    checkedIn: {
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
        reservation.belongsToMany(models.device, { through: modelUtils.reservationDevices(sequelize) });
        reservation.belongsTo(models.user, { as: 'approvedBy' });
        reservation.belongsTo(models.user, { as: 'checkedOutBy' });
        reservation.belongsTo(models.user, { as: 'checkedInBy' });
        reservation.belongsTo(models.user, { as: 'disabledBy' });
        reservation.belongsTo(models.user);
        reservation.belongsToMany(models.organization, {
          through: modelUtils.organizationReservation(sequelize),
        });
      },
    },
  });

  return reservation;
};
