const Sequelize = require('sequelize');

module.exports = {
  reservationDevices(sequelize) {
    return sequelize.define('reservation_devices', {
      quantity: Sequelize.INTEGER,
    });
  },
};
