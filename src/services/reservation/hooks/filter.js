'use strict';

const utils = require('../utils');
const _ = require('lodash');
const query = require('../../../utils/query');

module.exports = function (options) {
  return function (hook) {
    const models = hook.app.get('sequelize').models;

    if (hook.type === 'before') {
      if (hook.params.query.startDate && hook.params.query.endDate) {
        const { startDate, endDate } = hook.params.query;

        delete hook.params.query.startDate;
        delete hook.params.query.endDate;

        const where = Object.assign(query.getWhere(hook.params.query), utils.overlaps(startDate, endDate));

        hook.params.sequelize = {
          where,
        };
      }

      if (hook.params.query.$sort) {
        if (_.has(hook.params.query.$sort, 'status')) {
          if (hook.params.query.$sort.status === '-1') {
            hook.params.sequelize = Object.assign({
              order: [
                ['checkedOut', 'DESC'],
                ['checkedIn', 'ASC'],
              ],
            }, hook.params.sequelize);
          } else {
            hook.params.sequelize = Object.assign({
              order: [
                ['approved', 'ASC'],
                ['disabled', 'ASC'],
                ['checkedOut', 'ASC'],
                ['checkedIn', 'ASC'],
              ],
            }, hook.params.sequelize);
          }

          delete hook.params.query.$sort;
        }

        if (_.has(hook.params.query.$sort, 'user.fullName')) {
          if (hook.params.query.$sort['user.fullName'] === '-1') {
            hook.params.sequelize = Object.assign({
              order: [
                [{ model: models.user }, 'firstName', 'DESC'],
                [{ model: models.user }, 'lastName', 'DESC'],
              ],
            }, hook.params.sequelize);
          } else {
            hook.params.sequelize = Object.assign({
              order: [
                [{ model: models.user }, 'firstName', 'ASC'],
                [{ model: models.user }, 'lastName', 'ASC'],
              ],
            }, hook.params.sequelize);
          }

          delete hook.params.query.$sort;
        }

        if (_.has(hook.params.query.$sort, 'checkedOutBy.fullName')) {
          if (hook.params.query.$sort['checkedOutBy.fullName'] === '-1') {
            hook.params.sequelize = Object.assign({
              order: [
                [{ model: models.user, as: 'checkedOutBy' }, 'firstName', 'DESC'],
                [{ model: models.user, as: 'checkedOutBy' }, 'lastName', 'DESC'],
              ],
            }, hook.params.sequelize);
          } else {
            hook.params.sequelize = Object.assign({
              order: [
                [{ model: models.user, as: 'checkedOutBy' }, 'firstName', 'ASC'],
                [{ model: models.user, as: 'checkedOutBy' }, 'lastName', 'ASC'],
              ],
            }, hook.params.sequelize);
          }

          delete hook.params.query.$sort;
        }
      }
    }

    return hook;
  };
};
