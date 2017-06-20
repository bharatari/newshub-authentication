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
      allowNull: false,
    },
    label: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    link: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    logo: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    meta: {
      type: Sequelize.JSONB,
      allowNull: false,
      defaultValue: {},
    },
  }, {
    freezeTableName: true,
    classMethods: {
      associate(models) {
        organization.belongsToMany(models.user, {
          through: modelUtils.organizationUser(sequelize),
        });
      },
    },
  });  

  return organization;
};
