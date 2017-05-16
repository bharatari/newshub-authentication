'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.createTable('organization', {
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
      },
    });
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.dropTable('organization');
  }
};
