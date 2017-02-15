'use strict';

if (!process.env.S3_API_KEY) {
  require('dotenv').config();
}

const app = require('./app');
const port = app.get('port');
const server = app.listen(port);

server.on('listening', () =>
  console.log(`Feathers application started on ${app.get('host')}:${port}`)
);
