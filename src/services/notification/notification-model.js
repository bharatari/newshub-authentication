'use strict';

// notification-model.js - A sequelize model
//
// See http://docs.sequelizejs.com/en/latest/docs/models-definition/
// for more of what you can do here.

const Sequelize = require('sequelize');

module.exports = function (sequelize) {
  const notification = sequelize.define('notification', {
    title: {
      type: Sequelize.TEXT,
      allowNull: false,
    },
    body: {
      type: Sequelize.TEXT,
      allowNull: false,
    },
    type: {
      type: Sequelize.TEXT,
      allowNull: false,
    },
    icon: {
      type: Sequelize.TEXT,
    },
    sound: {
      type: Sequelize.TEXT,
    },
    actionId: {
      type: Sequelize.TEXT,
    },
    read: {
      type: Sequelize.BOOLEAN,
    },
  }, {
    freezeTableName: true,
    classMethods: {
      associate(models) {
        notification.belongsTo(models.user, { as: 'recipient' });
        notification.belongsTo(models.user, { as: 'sender' });
        notification.belongsTo(models.organization);
        notification.belongsTo(models.activity);
      },
    },
  });

  return notification;
};
