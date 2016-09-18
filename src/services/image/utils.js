'use strict';

const _ = require('lodash');
const Chance = require('chance');
const chance = new Chance();

module.exports = {
  protect(run, onError) {
    var domain = require('domain').create();
    domain.on('error', onError);
    domain.run(run);
  },
  generateFileName(fileName) {
    return chance.hash({ length: 15 }) + Date.now() + this.getFileType(fileName);
  },
  getFileType(fileName) {
    if (_.isString(fileName)) {
      const index = fileName.lastIndexOf('.');

      if (index === -1) {
        return '';
      } else {
        if ((index + 1) === fileName.length) {
          return '';
        } else {
          const type = fileName.slice(index, fileName.length);

          return type;
        }
      }
    } else {
      return '';
    }
  },
};
