'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('user', 'image', Sequelize.TEXT);
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('user', 'image');
  }
};
