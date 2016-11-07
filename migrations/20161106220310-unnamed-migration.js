'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.addColumn('user', 'options', Sequelize.JSONB);
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.removeColumn('user', 'options');
  }
};
