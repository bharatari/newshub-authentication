'use strict'

const Sequelize = require('sequelize');
const _ = require('lodash');

module.exports = {
  mergeQuery(query, where, include, order) {
    if (!_.isEmpty(query)) {
      let combinedWhere = null;
      let combinedInclude = null;
      let combinedOrder = null;

      let result = {};

      if (where) {
        combinedWhere = Object.assign({}, where, query.where);

        result.where = combinedWhere;
      } else if (query.where) {
        combinedWhere = query.where;

        result.where = combinedWhere;
      }

      if (include) {
        if (!query.include) {
          query.include = [];
        }

        combinedInclude = [
          ...query.include,
          ...include,
        ];

        result.include = combinedInclude;
      } else if (query.include) {
        combinedInclude = query.include;

        result.include = combinedInclude;
      }

      if (order) {
        if (!query.order) {
          query.order = [];
        }

        combinedOrder = [
          ...query.order,
          ...order,
        ];

        result.order = combinedOrder;
      } else if (query.order) {
        combinedOrder = query.order;

        result.order = combinedOrder;
      }

      return result;
    }

    let result = {};

    if (where) {
      result.where = _.omit(where, ['$limit', '$sort', '$skip', '$select', '$populate']);
    }

    if (include) {
      result.include = include;
    }

    if (order) {
      result.order = order;
    }
    
    return result;
  },
  reservationDevices(sequelize) {
    return sequelize.define('reservation_devices', {
      quantity: Sequelize.INTEGER,
    });
  },
  organizationUsers(sequelize) {
    return sequelize.define('organization_users', {
      roles: Sequelize.TEXT,
      title: Sequelize.TEXT,
    });
  },
};
