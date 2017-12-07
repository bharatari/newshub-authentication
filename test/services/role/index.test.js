'use strict';

const assert = require('assert');
const app = require('../../../src/app');
const chai = require('chai');

let user;
let admin;
let master;

const should = chai.should();

describe('role service', () => {
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

  it('registered the role service', () => {
    assert.ok(app.service('/api/role'));
  });

  it('should resolve roles', (done) => {
    chai.request(app)
      .get(`/api/role?roles=all`)
      .set('Accept', 'application/json')
      .set('Authorization', 'Bearer '.concat(admin))
      .end((err, res) => {
        res.should.have.status(200);

        done();
      });
  });
});
