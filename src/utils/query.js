const _ = require('lodash');

module.exports = {
  getWhere(query) {
    const PROPERTIES = ['$sort', '$limit', '$skip', '$select', '$populate'];

    return _.omit(query, ...PROPERTIES);
  },
}
