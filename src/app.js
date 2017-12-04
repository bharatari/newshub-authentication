'use strict';

const path = require('path');
const express = require('@feathersjs/express');
const favicon = require('serve-favicon');
const compress = require('compression');
const cors = require('cors');
const helmet = require('helmet');
const logger = require('winston');
const feathers = require('@feathersjs/feathers');
const configuration = require('@feathersjs/configuration');
const rest = require('@feathersjs/express/rest');
const socketio = require('@feathersjs/socketio');

const sequelize = require('./sequelize');
const middleware = require('./middleware');
const authentication = require('./authentication');
const channels = require('./channels');
const services = require('./services');
const appHooks = require('./app.hooks');
const skipper = require('skipper');
const redis = require('./utils/redis');

const app = express(feathers());

app.configure(configuration());

app.use(cors());
app.use(helmet());
app.use(compress());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(favicon(path.join(app.get('public'), 'favicon.ico')));

// Host the public folder
app.use('/', express.static(app.get('public')));
app.use('/app/*', express.static(app.get('public')));

app.use(skipper());

// Set up Plugins and providers
app.configure(express.rest());
app.configure(socketio());

app.configure(sequelize);

// Configure other middleware (see `middleware/index.js`)
app.configure(middleware);
app.configure(authentication);
// Set up our services (see `services/index.js`)
app.configure(services);
// Set up event channels (see channels.js)
app.configure(channels);
app.configure(redis);

// Configure a middleware for 404s and the error handler
app.use(express.notFound());
app.use(express.errorHandler({ logger }));

app.hooks(appHooks);

module.exports = app;
