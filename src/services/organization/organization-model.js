'use strict';

// organization-model.js - A sequelize model
// 
// See http://docs.sequelizejs.com/en/latest/docs/models-definition/
// for more of what you can do here.

const Sequelize = require('sequelize');
const modelUtils = require('../../utils/models');

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
        organization.belongsToMany(models.user, {
          through: modelUtils.organizationUser(sequelize),
        });
        organization.belongsToMany(models.roomReservation, {
          through: modelUtils.organizationRoomReservation(sequelize),
        });
        organization.belongsToMany(models.reservation, {
          through: modelUtils.organizationReservation(sequelize),
        });
        organization.belongsToMany(models.device, {
          through: modelUtils.organizationDevice(sequelize),
        });
        organization.belongsToMany(models.room, {
          through: modelUtils.organizationRoom(sequelize),
        });
        organization.belongsToMany(models.building, {
          through: modelUtils.organizationBuilding(sequelize),
        });
      },
    },
  });  

  return organization;
};
