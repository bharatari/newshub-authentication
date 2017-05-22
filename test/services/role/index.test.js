'use strict';

const assert = require('assert');
const app = require('../../../src/app');
const chai = require('chai');
const chaiHttp = require('chai-http');
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

describe.only('role service', () => {
  before((done) => {
    this.server = app.listen(3030);

    chai.request(app)
      .post('/api/login')
      .set('Accept', 'application/json')
      .send({
        username: 'normal',
        password: 'password',
      })
      .end((err, res) => {
        user = res.body.token;

        chai.request(app)
          .post('/api/login')
          .set('Accept', 'application/json')
          .send({
            username: 'admin',
            password: 'password',
          })
          .end((err, res) => {
            admin = res.body.token;

            chai.request(app)
              .post('/api/login')
              .set('Accept', 'application/json')
              .send({
                username: 'master',
                password: 'password',
              })
              .end((err, res) => {
                master = res.body.token;

                done();
              });
          });
      });
  });

  after((done) => {
    this.server.close(() => {
      done();
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
