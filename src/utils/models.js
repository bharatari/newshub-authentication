const Sequelize = require('sequelize');

module.exports = {
  reservationDevices(sequelize) {
    return sequelize.define('reservation_devices', {
      quantity: Sequelize.INTEGER,
    });
  },
  organizationUser(sequelize) {
    return sequelize.define('organization_user', {
      roles: Sequelize.STRING,
      title: Sequelize.STRING,
    });
  },
  organizationRoomReservation(sequelize) {
    return sequelize.define('organization_roomReservation', {
      owner: Sequelize.BOOLEAN,
    });
  },
  organizationReservation(sequelize) {
    return sequelize.define('organization_reservation', {
      owner: Sequelize.BOOLEAN,
    });
  },
  organizationDevice(sequelize) {
    return sequelize.define('organization_device', {
      owner: Sequelize.BOOLEAN,
    });
  },
  organizationRoom(sequelize) {
    return sequelize.define('organization_room', {
      owner: Sequelize.BOOLEAN,
    });
  },
  organizationBuilding(sequelize) {
    return sequelize.define('organization_building', {
      owner: Sequelize.BOOLEAN,
    });
  },
  organizationImage(sequelize) {
    return sequelize.define('organization_image');
  }
};
