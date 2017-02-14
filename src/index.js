'use strict';

if (process.env.NODE_ENV === 'development') {
  require('dotenv').config();
}

const app = require('./app');
const port = app.get('port');
const server = app.listen(port);

server.on('listening', () =>
  console.log(`Feathers application started on ${app.get('host')}:${port}`),
);
