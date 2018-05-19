'use strict';

if (!process.env.S3_API_KEY) {
  require('dotenv').config();
}

const assert = require('assert');
const request = require('request');
const fixtures = require('sequelize-fixtures');
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const chaiHttp = require('chai-http');
const authentication = require('@feathersjs/authentication');
const jwt = require('@feathersjs/authentication-jwt');
const local = require('@feathersjs/authentication-local');
const bodyParser = require('body-parser');

const app = require('../src/app');
const organization = require('./fixtures/organization');
const user = require('./fixtures/user');
const resetPasswordToken = require('./fixtures/resetPasswordToken');
const role = require('./fixtures/role');
const signupToken = require('./fixtures/signupToken');
const associate = require('./fixtures/associate');

chai.use(chaiHttp);

describe('Feathers application tests', () => {
  before(function (done) {
    chai.use(chaiAsPromised);
      
    this.server = app.listen(3030);
    
    this.server.once('listening', async () => {
      try {
        const models = app.get('sequelize').models;
        
        await fixtures.loadFixtures(organization(models), models);
        await fixtures.loadFixtures(user(models), models);
        await fixtures.loadFixtures(resetPasswordToken(models), models)
        await fixtures.loadFixtures(role(models), models);
        await fixtures.loadFixtures(signupToken(models), models);
        
        await associate(models);
      } catch (e) {
        throw e;
      }
  
      done();
    });
  });

  after(function (done) {
    this.server.close(done);
  });

  it('starts and shows the index page', (done) => {
    request('http://localhost:3030', (err, res, body) => {
      assert.ok(body.indexOf('<html>') !== -1);
      done(err);
    });
  });

  describe('404', () => {
    it('shows a 404 HTML page', (done) => {
      request({
        url: 'http://localhost:3030/path/to/nowhere',
        headers: {
          Accept: 'text/html',
        },
      }, (err, res, body) => {
        assert.equal(res.statusCode, 404);
        assert.ok(body.indexOf('<html>') !== -1);
        done(err);
      });
    });

    it('shows a 404 JSON error without stack trace', (done) => {
      request({
        url: 'http://localhost:3030/path/to/nowhere',
        json: true,
      }, (err, res, body) => {
        assert.equal(res.statusCode, 404);
        assert.equal(body.code, 404);
        assert.equal(body.message, 'Page not found');
        assert.equal(body.name, 'NotFound');
        done(err);
      });
    });
  });
});
