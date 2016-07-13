'use strict';

module.exports = function (options) {
  return function (hook) {
    const models = hook.app.get('sequelize').models;

    if (hook.type === 'before') {
      hook.params.sequelize = {
        include: [{
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
        }],
      };
    }

    return hook;    
  };
};
