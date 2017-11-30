'use strict';

const errors = require('@feathersjs/errors');
const _ = require('lodash');

module.exports = function (options) {
  return async function (hook) {
    if (hook.method === 'patch' && !_.isNil(hook.id) && !_.isNil(hook.data.currentOrganizationId)) {
      const models = hook.app.get('sequelize').models;

      try {
        const user = await models.user.findOne({
          where: {
            id: hook.id,
          },
          include: [{
            model: models.organization,
            as: 'currentOrganization',
          }],
        });
        
        hook.result = user;

        return hook;
      } catch (e) {
        return hook;
      }
    }
  };
};
