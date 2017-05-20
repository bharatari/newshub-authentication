'use strict';

// Add any common hooks you want to share across services in here.
//
// Below is an example of how a hook is written and exported. Please
// see http://docs.feathersjs.com/hooks/readme.html for more details
// on hooks.

const access = require('../utils/access');
const errors = require('feathers-errors');

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

    /*
    if (hook.method === 'update' || 'patch' || 'get') {
      if (options.belongsToMany) {
        let object;

        try {
          object = await models[options.model].findOne({
            where: {
              id: hook.id
            },
            include: [{
              model: models.organization,
              where: {
                id: hook.params.user.currentOrganizationId,
              },
            }]
          });
        } catch (e) {
          throw e;
        }

        if (object.organizations) {
          if (object.organizations[0]) {
            return hook;
          } else {
            throw new errors.NotAuthenticated();
          }
        } else {
          throw new errors.NotAuthenticated();
        }
        
        return hook;
      } else {
        let object;

        try {
          object = await models[options.model].findOne({
            where: {
              id: hook.id
            }
          });
        } catch (e) {
          throw e;
        }

        if (object.organizationId !== hook.params.user.currentOrganizationId) {
          throw new errors.NotAuthenticated();
        }
        
        return hook;
      }
    } else if (hook.method === 'find') {
      const query = `$organizations.organization_${options.model}.organizationId$`;
  
      if (options.belongsToMany) {
        hook.params.sequelize = {
          // ...hook.params.sequelize,
          where: {
            [query]: hook.params.user.currentOrganizationId,
          },
        };
      } else {
        hook.params.sequelize = {
          // ...hook.params.sequelize,
          where: {
            // ...hook.params.sequelize.where,
            organizationId: hook.params.user.currentOrganizationId,
          }
        };
      }
    }*/

    return hook;
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
