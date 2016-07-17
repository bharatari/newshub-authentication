'use strict';

module.exports = function (options) {
  return function (hook) {
    const models = hook.app.get('sequelize').models;

    if (hook.type === 'before') {
      const include = [{
        model: models.user,
        as: 'approvedBy',
      }, {
        model: models.user,
        as: 'checkedOutBy',
      }, {
        model: models.user,
        as: 'checkedInBy',
      }, {
        model: models.device,
      }, {
        model: models.user,
      }];

      if (hook.params.sequelize) {
        hook.params.sequelize.include = include;
      } else {
        hook.params.sequelize = {
          include,
        };
      }
    }

    return hook;    
  };
};
