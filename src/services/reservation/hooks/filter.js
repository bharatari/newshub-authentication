'use strict';

const utils = require('../utils');
const _ = require('lodash');
const query = require('../../../utils/query');

module.exports = function (options) {
  return function (hook) {
    const models = hook.app.get('sequelize').models;

    if (hook.type === 'before') {
      if (hook.params.query.startDate && hook.params.query.endDate) {
        const { startDate, endDate } = hook.params.query;

        delete hook.params.query.startDate;
        delete hook.params.query.endDate;

        const where = Object.assign(query.getWhere(hook.params.query), utils.overlaps(startDate, endDate));

        hook.params.sequelize = {
          where,
        };
      } else {
        hook.params.sequelize = {};
      }
    }

    return hook;
  };
};
