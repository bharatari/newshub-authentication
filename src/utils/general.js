const _ = require('lodash');

module.exports = {
  cleanString(str) {
    if (_.isString(str)) {
      return str.toLowerCase().trim();
    }

    return str;
  },
};
