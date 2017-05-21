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

          hook.params.sequelize = modelUtils.mergeQuery(hook.params.sequelize, query, include);
        } else {
          const where = {
            organizationId: hook.params.user.currentOrganizationId,
          };
          const include = [{
            model: models.organization,
          }];

          hook.params.sequelize = modelUtils.mergeQuery(hook.params.sequelize, query, include);
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

    if (options.belongsToMany) {
      if (hook.data.organizationIds) {
        const oldIds = _.map(object.organizations, 'id'); 
        const newIds = hook.data.organizationIds;

        const added = _.difference(newIds, oldIds);
        const removed = _.difference(oldIds, newIds);


        // check orgIds array against plucked array of org ids from object

        // check that added orgs are valid

        // theoretically someone who has access to an object in an org can "share" the object with another org
        // so the user modifying this value must be part of one of the original orgs and also have the proper role to share with other orgs
      }
    } else {
      if (hook.data.organizationId !== object.organizationId) {
        throw new errors.BadRequest();
      }
    }

    return hook;
  }
}
