'use strict';
const utils = require('../utils');

module.exports = function (options) {
  return function (hook) {
    const models = hook.app.get('sequelize').models;

    if (hook.type === 'before') {
      if (hook.params.query.startDate && hook.params.query.endDate) {
        hook.params.sequelize = {
          where: utils.overlaps(hook.params.query.startDate, hook.params.query.endDate),
        };

        delete hook.params.query.startDate;
        delete hook.params.query.endDate;
      } else {
        hook.params.sequelize = {};
      }      
    }

    return hook;    
  };
};
