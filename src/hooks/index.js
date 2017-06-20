'use strict';

// Add any common hooks you want to share across services in here.
//
// Below is an example of how a hook is written and exported. Please
// see http://docs.feathersjs.com/hooks/readme.html for more details
// on hooks.

const access = require('../utils/access');
const errors = require('feathers-errors');
const modelUtils = require('../utils/models');

exports.checkAccess = function (options) {
  return function (hook) {
    const models = hook.app.get('sequelize').models;
    const redis = hook.app.get('redis');

    if (hook.type === 'before') {
      return access.can(models, redis, hook.params.user.id, options.service, hook.method)
        .then((result) => {
          if (result) {
            return hook;
          }

          throw new errors.NotAuthenticated();
        })
        .catch((err) => {
          throw err;
        });
    }

    return hook;
  };
};

exports.protectOrganization = function (options) {
  return async function (hook) {
    const models = hook.app.get('sequelize').models;
    
    if (hook.params.provider) {
      if (hook.method === 'update' || hook.method === 'patch' || hook.method === 'get') {
        if (options.belongsToMany) {
          const query = `$organizations.organization_${options.model}.organizationId$`;

          return models[options.model].findOne({
            where: {
              id: hook.id,
              [query]: hook.params.user.currentOrganizationId,
            },
            include: [{
              model: models.organization,
            }],
          }).then((object) => {
            if (object) {
              return hook;
            } else {
              throw new errors.NotAuthenticated();
            }
          }).catch((e) => {
            throw e;
          });
        } else {
          return models[options.model].findOne({
            where: {
              id: hook.id
            }
          }).then((object) => {
            if (object.organizationId !== hook.params.user.currentOrganizationId) {
              throw new errors.NotAuthenticated();
            }

            return hook;
          }).catch((e) => {
            throw e;
          });
        }
      } else if (hook.method === 'find') {
        const query = `$organizations.organization_${options.model}.organizationId$`;
    
        if (options.belongsToMany) {
          const where = {
            [query]: hook.params.user.currentOrganizationId,
          };

          const include = [{
            model: models.organization,
          }];

          hook.params.sequelize = modelUtils.mergeQuery(hook.params.sequelize, where, include);
        } else {
          hook.params.organizationId = hook.params.user.currentOrganizationId;

          const include = [{
            model: models.organization,
          }];

          hook.params.sequelize = modelUtils.mergeQuery(hook.params.sequelize, null, include);
        }
      }

      return hook;
    }
  }
}

exports.restrictChangeOrganization = function (options) {
  return async function (hook) {
    const models = hook.app.get('sequelize').models;

    const object = await models[options.model].findOne({
      where: {
        id: hook.id,
      },
      include: [{
        model: models.organization,
      }]
    });

    if (hook.method === 'patch' || hook.method === 'update') {
      if (options.belongsToMany) {
        if (hook.data.organizationIds) {
          const oldIds = _.map(object.organizations, 'id'); 
          const newIds = hook.data.organizationIds;

          const added = _.difference(newIds, oldIds);
          const removed = _.difference(oldIds, newIds);

          if (added.length > 1) {
            throw new errors.BadRequest('Cannot add more than one organization at a time');
          } else if (added.length === 1) {
            let organization;

            try {
              organization = await models.organization.findOne({
                where: {
                  id: added[0],
                }
              });
            } catch (e) {
              throw e;
            }

            if (!organization) {
              throw new errors.BadRequest('Added organization does not exist');
            }
          }
        }
      } else {
        if (hook.data.organizationId) {
          if (hook.data.organizationId !== object.organizationId) {
            throw new errors.BadRequest();
          }
        }
      }
    }   

    return hook;    
  }
}

exports.addToOrganization = function (options) {
  return async function (hook) {
    if (hook.method === 'create' && hook.type === 'before') {
      hook.data.organizationId = hook.params.user.currentOrganizationId;
    }

    return hook;    
  }
}
