/* eslint no-console: 0 */

'use strict';

const redis = require('redis');

module.exports = function () {
  const app = this;

  const client = redis.createClient({
    url: app.get('keys').REDIS_URL,
  });
  
  client.on('error', (err) => {
    console.log(err);
  });
  
  app.set('redis', client);
};
