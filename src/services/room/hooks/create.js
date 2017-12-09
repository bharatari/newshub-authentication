'use strict';

module.exports = function (options) {
  return function (hook) {
    const models = hook.app.get('sequelize').models;

    return models.user.findOne({
      where: {
        id: hook.params.user.id,
      },
      include: [{
        model: models.organization,
        as: 'currentOrganization',
      }],
    }).then((user) => {
      hook.data.name += '_' + user.currentOrganization.name;

      return hook;
    }).catch((err) => {
      throw err;
    });    
  };
};
