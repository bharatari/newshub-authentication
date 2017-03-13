'use strict';

const access = require('../../../utils/access');

module.exports = function (options) {
  return async function (hook) {
    const models = hook.app.get('sequelize').models;
    const redis = hook.app.get('redis');

    const hasAutoApprove = await access.has(models, redis, hook.params.user.id, 'roomReservation:auto-approve');

    if (hasAutoApprove) {
      hook.data.approved = true;
      hook.data.approvedById = hook.params.user.id;
    }
  };
};
