'use strict';

/* eslint eqeqeq: 0 */

const errors = require('@feathersjs/errors');
const moment = require('moment');
const _ = require('lodash');
const access = require('../../../utils/access');

module.exports = async function (options) {
  return function (hook) {
    const models = hook.app.get('sequelize').models;
    const redis = hook.app.get('redis');

    const { currentOrganizationId } = hook.data;

    if (_.size(hook.data) > 1) {
      throw new errors.BadRequest('You cannot edit other fields while switching organizations.');
    }

    const user = await models.user.findOne({
      where: {
        id: hook.id,
      },
      include: [{
        model: models.organization,
        where: {
          '$organizations.organization_users.organizationId$': currentOrganizationId,
        },
      }],
    });

    if (!_.isNil(currentOrganizationId) && (currentOrganizationId !== user.currentOrganizationId)) {
      if (hook.params.user.id != hook.id) {
        throw new errors.Forbidden('You do not have the permission to switch organizations.');
      }
    }

    if (!user.get('organizations')[0]) {
      throw new errors.Forbidden('You do not belong to the organization you are trying to switch to.');
    }
    
    // Skip editing user fields
    hook.params.skip = true;

    return hook;
  };
};
