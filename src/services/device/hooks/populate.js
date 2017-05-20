'use strict';

module.exports = function (options) {
  return function (hook) {
    const models = hook.app.get('sequelize').models;

    if (hook.type === 'before') {
      const include = [{
        model: models.image,
        as: 'thumbnail',
      }];

      if (hook.params.sequelize) {
        hook.params.sequelize.include = include;
      } else {
        hook.params.sequelize = {
          include,
          where: {
            '$organizations.organization_device.organizationId$': hook.params.user.currentOrganizationId,
          },
        };
      }
    }

    return hook;
  };
};
