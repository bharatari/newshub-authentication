'use strict';

const email = require('../../../utils/email');
const access = require('../../../utils/access');

module.exports = function (options) {
  return async function (hook) {
    const models = hook.app.get('sequelize').models;
    const redis = hook.app.get('redis');

    const hasAutoApprove = await access.has(models, redis, hook.params.user.id, 'roomReservation:auto-approve');

    if (hasAutoApprove) {
      return hook;
    } else {
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
          await email.queueEmails(users, null, hook.params.user.fullName, 'CREATED_ROOM_RESERVATION');

          return hook;
        } catch (e) {
          // Don't throw error just because email didn't send
          return hook;
        }
      });
    }
  };
};
