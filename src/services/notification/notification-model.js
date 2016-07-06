'use strict';

// notification-model.js - A sequelize model
// 
// See http://docs.sequelizejs.com/en/latest/docs/models-definition/
// for more of what you can do here.

const Sequelize = require('sequelize');

module.exports = function(sequelize) {
  const notification = sequelize.define('notification', {
    title: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    body: {
      type: Sequelize.STRING, 
      allowNull: false,
    },
    type: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    icon: {
      type: Sequelize.STRING,
    },
    sound: {
      type: Sequelize.STRING,
    },
    actionId: {
      type: Sequelize.STRING,
    },
  }, {
    freezeTableName: true,
    classMethods: {
      associate(models) {
        notification.belongsTo(models.user, { as: 'recipient' });
        notification.belongsTo(models.user, { as: 'sender' });
      },
    },
  });

  return notification;
};
