'use strict';

const Chance = require('chance');
const chance = new Chance();
const moment = require('moment');

module.exports = function (options) {
  return function (hook) {
    const models = hook.app.get('sequelize').models;

    hook.data.token = chance.hash();
    hook.data.expires = moment().add(3, 'days').toDate();

    return hook;    
  };
};
