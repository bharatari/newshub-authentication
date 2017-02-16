'use strict';

const _ = require('lodash');
const domain = require('domain');
const Chance = require('chance');

const chance = new Chance();

module.exports = {
  protect(run, onError) {
    const d = domain.create();
    d.on('error', onError);
    d.run(run);
  },
  generateFileName(fileName) {
    return chance.hash({ length: 15 }) + Date.now() + this.getFileType(fileName);
  },
  getFileType(fileName) {
    if (_.isString(fileName)) {
      const index = fileName.lastIndexOf('.');

      if (index === -1) {
        return '';
      } else if ((index + 1) === fileName.length) {
        return '';
      }

      const type = fileName.slice(index, fileName.length);

      return type;
    }

    return '';
  },
};
