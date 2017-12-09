'use strict';

const Chance = require('chance');
const chance = new Chance();
const moment = require('moment');

module.exports = function (options) {
  return function (hook) {
    const models = hook.app.get('sequelize').models;

    hook.data.token = chance.hash({ casing: 'upper', length: 6 });
    hook.data.expires = moment().add(3, 'days').toDate();
    hook.data.organizationId = hook.params.user.currentOrganizationId;

    return hook;
  };
};
