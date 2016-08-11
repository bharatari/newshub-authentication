'use strict';

module.exports = {
  protect(run, onError) {
    var domain = require('domain').create();
    domain.on('error', onError);
    domain.run(run);
  },
};
