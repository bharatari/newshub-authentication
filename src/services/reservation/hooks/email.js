'use strict';

const async = require('async');
const email = require('../../../utils/email');

module.exports = function (options) {
  return function (hook) {
    return hook.app.get('sequelize').models.user.findAll({
      where: {
        '$organizations.organization_user.organizationId$': hook.params.user.currentOrganizationId,
        $or: [
          {
            '$organizations.organization_user.roles$': {
              $like: '%admin%',
            },
          },
          {
            '$organizations.organization_user.roles$': {
              $like: '%master%',
            }
          },
        ],
        options: {
          $or: [
            {
              doNotDisturb: null,
            },
            {
              doNotDisturb: {
                $not: true,
              },
            },
          ],
        },
      },
      include: [{
        model: hook.app.get('sequelize').models.organization,
      }],
    }).then(async (data) => {
      const users = JSON.parse(JSON.stringify(data));

      try {
        await email.queueEmails(users, null, hook.params.user.fullName, 'CREATED_RESERVATION');

        return hook;
      } catch (e) {
        // Don't throw error just because email didn't send
        return hook;
      }
    });
  };
};
