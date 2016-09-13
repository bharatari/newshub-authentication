'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');
const assert = require('assert');
const app = require('../../../src/app');
const User = app.service('/api/user');
const Device = app.service('/api/device');
const Token = app.service('/api/signup-token');
const authentication = require('feathers-authentication/client');
const bodyParser = require('body-parser');
let user;
let admin;
let master;

app
  .use(bodyParser.json())
  .use(bodyParser.urlencoded({ extended: true }))
  .configure(authentication());

chai.use(chaiHttp);

const should = chai.should();

describe('device service', function () {
  before((done) => {
    this.server = app.listen(3030);

    this.server.once('listening', () => {
      chai.request(app)
        .post('/api/login')
        .set('Accept', 'application/json')
        .send({
          'username': 'normal',
          'password': 'password',
        })
        .end((err, res) => {
          user = res.body.token;

          chai.request(app)
            .post('/api/login')
            .set('Accept', 'application/json')
            .send({
              'username': 'admin',
              'password': 'adminpassword',
            })
            .end((err, res) => {
              admin = res.body.token;

              chai.request(app)
                .post('/api/login')
                .set('Accept', 'application/json')
                .send({
                  'username': 'master',
                  'password': 'masterpassword',
                })
                .end((err, res) => {
                  master = res.body.token;
                  done();
                });
            });
        });
    });
  });
  after((done) => {
    User.remove(null, () => {
      Device.remove(null, () => {
        this.server.close(function () {
          done();
        });
      });
    });
  });
  it('registered the device service', () => {
    assert.ok(app.service('/api/device'));
  });
  it('should allow masters to create a device', function (done) {
    chai.request(app)
      .post('/api/device')
      .set('Accept', 'application/json')
      .set('Authorization', 'Bearer '.concat(master))
      .send({
        name: 'DEVICE1',
        label: 'Device',
        type: 'Device',
        quantity: 1,
      })
      .end((err, res) => {
        res.should.have.status(201);
        done();
      });
  });
  it('should not allow admins to create a device', function (done) {
    chai.request(app)
      .post('/api/device')
      .set('Accept', 'application/json')
      .set('Authorization', 'Bearer '.concat(admin))
      .send({
        name: 'DEVICE2',
        label: 'Device',
        type: 'Device',
        quantity: 1,
      })
      .end((err, res) => {
        res.should.have.status(401);
        done();
      });
  });
  it('should not allow normal users to create a device', function (done) {
    chai.request(app)
      .post('/api/device')
      .set('Accept', 'application/json')
      .set('Authorization', 'Bearer '.concat(user))
      .send({
        name: 'DEVICE3',
        label: 'Device',
        type: 'Device',
        quantity: 1,
      })
      .end((err, res) => {
        res.should.have.status(401);
        done();
      });
  });
});
