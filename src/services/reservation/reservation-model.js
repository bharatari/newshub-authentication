'use strict';

// reservation-model.js - A sequelize model
// 
// See http://docs.sequelizejs.com/en/latest/docs/models-definition/
// for more of what you can do here.

const Sequelize = require('sequelize');

module.exports = function(sequelize) {
  const reservation = sequelize.define('reservation', {
    notes: {
      type: Sequelize.STRING,
    },
    approved: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
    },
    checkedOut: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
    }
  }, {
    freezeTableName: true,
    classMethods: {
      associate(models) {
        reservation.belongsToMany(models.device, { through: 'reservation_devices' });
        reservation.belongsTo(models.user, { as: 'approvedBy' });
        reservation.belongsTo(models.user, { as: 'checkedOutBy' });
        reservation.belongsTo(models.user);
      },
    },
  });

  return reservation;
};
