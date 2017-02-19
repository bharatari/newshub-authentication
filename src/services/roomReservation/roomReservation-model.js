'use strict';

// roomReservation-model.js - A sequelize model
// 
// See http://docs.sequelizejs.com/en/latest/docs/models-definition/
// for more of what you can do here.

const Sequelize = require('sequelize');

module.exports = function(sequelize) {
  const roomReservation = sequelize.define('roomReservation', {
    text: {
      type: Sequelize.STRING,
      allowNull: false,
    },
  }, {
    freezeTableName: true,
    classMethods: {
      associate(models) {
        roomReservation.belongsTo(models.room);
      },
    },
  });

  return roomReservation;
};
