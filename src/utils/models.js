'use strict'

const Sequelize = require('sequelize');
const _ = require('lodash');

module.exports = {
  mergeQuery(query, where, include) {
    if (!_.isEmpty(query)) {
      let combinedWhere = null;
      let combinedInclude = null;
      let result = {};

      if (where && query.where) {
        combinedWhere = Object.assign({}, where, query.where);
        
        result.where = combinedWhere;
      }

      if (include && query.include) {
        combinedInclude = [
          ...query.include,
          ...include,
        ];

        result.include = combinedInclude;
      }

      return result;
    }

    let result = {};

    if (where) {
      result.where = where;
    }

    if (include) {
      result.include = include;
    }

    return result;
  },
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
};
