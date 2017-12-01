'use strict';

const path = require('path');
const express = require('@feathersjs/express');
const favicon = require('serve-favicon');
const compress = require('compression');
const cors = require('cors');
const feathers = require('@feathersjs/feathers');
const configuration = require('@feathersjs/configuration');
const rest = require('@feathersjs/express/rest');
const bodyParser = require('body-parser');
const socketio = require('@feathersjs/socketio');
const middleware = require('./middleware');
const services = require('./services');
const appHooks = require('./app.hooks');
const skipper = require('skipper');
const redis = require('./utils/redis');

const app = express(feathers());

app.configure(configuration(path.join(__dirname, '..')));

app.use(compress())
  .options('*', cors())
  .use(cors())
  .use(favicon(path.join(app.get('public'), 'favicon.ico')))
  .use('/', express.static(app.get('public')))
  .use('/app/*', express.static(app.get('public')))
  .use(bodyParser.json())
  .use(bodyParser.urlencoded({ extended: true }))
  .use(skipper())
  .configure(rest())
  .configure(socketio())
  .configure(services)
  .configure(middleware)
  .configure(redis)
  .hooks(appHooks);

module.exports = app;
