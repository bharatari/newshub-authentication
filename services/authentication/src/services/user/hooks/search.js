'use strict';

const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const _ = require('lodash');

module.exports = function (options) {
  return async function (hook) {
    const models = hook.app.get('sequelize').models;
    const search = hook.params.query ? hook.params.query.search : null;

    if (!_.isNil(search)) {
      let firstName = search;
      let lastName = search;

      if (search.includes(' ')) {
        firstName = search.substring(0, search.indexOf(' '));
        lastName = search.substring(search.indexOf(' ') + 1);
      }

      const firstNameUsers = await models.user.findAll({
        where: {
          firstName: {
            [Op.iLike]: `%${firstName}%`,
          },
        },
      });

      const lastNameUsers = await models.user.findAll({
        where: {
          lastName: {
            [Op.iLike]: `%${lastName}%`,
          },
        },
      });
  
      let result = firstNameUsers.concat(lastNameUsers);
      result = _.uniqBy(result, 'id');

      hook.result = result;
  
      delete hook.params.query.search;
    }

    return hook;
  };
};
