'use strict';

/* eslint no-shadow: 0 */

const chai = require('chai');
const assert = require('assert');
const app = require('../../../src/app');
const User = app.service('/api/user');
const Device = app.service('/api/device');
const Token = app.service('/api/signup-token');

let user;
let admin;
let master;

const should = chai.should();

describe('device service', function () {
  before((done) => {
    chai.request(app)
      .post('/api/login')
      .set('Accept', 'application/json')
      .send({
        strategy: 'local',
        username: 'normal',
        password: 'password',
      })
      .end((err, res) => {
        user = res.body.accessToken;

        chai.request(app)
          .post('/api/login')
          .set('Accept', 'application/json')
          .send({
            strategy: 'local',
            username: 'admin',
            password: 'password',
          })
          .end((err, res) => {
            admin = res.body.accessToken;

            chai.request(app)
              .post('/api/login')
              .set('Accept', 'application/json')
              .send({
                strategy: 'local',
                username: 'master',
                password: 'password',
              })
              .end((err, res) => {
                master = res.body.accessToken;

                done();
              });
          });
      });
  });

  it('registered the device service', () => {
    assert.ok(app.service('/api/device'));
  });

  it('should allow masters to create a device', (done) => {
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

  it('should not allow admins to create a device', (done) => {
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

  it('should not allow normal users to create a device', (done) => {
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

  it('should not return devices within organization', async (done) => {
    const device = await app.get('sequelize').models.device.findOne({
      where: {
        name: 'Zoom H6'
      }
    });

    chai.request(app)
      .get(`/api/device/${device.id}`)
      .set('Accept', 'application/json')
      .set('Authorization', 'Bearer '.concat(user))
      .end((err, res) => {
        res.should.have.status(401);
        done();
      });
  });

  it('should return devices within organization', async (done) => {
    const device = await app.get('sequelize').models.device.findOne({
      where: {
        name: 'Mixer 1 Tascam'
      }
    });

    chai.request(app)
      .get(`/api/device/${device.id}`)
      .set('Accept', 'application/json')
      .set('Authorization', 'Bearer '.concat(user))
      .end((err, res) => {
        res.should.have.status(200);
        done();
      });
  });
});
