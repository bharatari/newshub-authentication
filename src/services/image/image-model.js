'use strict';

// image-model.js - A sequelize model
//
// See http://docs.sequelizejs.com/en/latest/docs/models-definition/
// for more of what you can do here.

const Sequelize = require('sequelize');

module.exports = function (sequelize) {
  const image = sequelize.define('image', {
    cdn: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    fileName: {
      type: Sequelize.STRING,
      allowNull: false,
    },
  }, {
    freezeTableName: true,
    classMethods: {
      associate(models) {
        image.belongsTo(models.user);
      },
    },
    getterMethods: {
      url() {
        return this.cdn + this.fileName;
      },
    },
  });

  return image;
};
