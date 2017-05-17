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

describe('signupToken service', () => {
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

  it('registered the signupToken service', () => {
    assert.ok(app.service('/api/signup-token'));
  });

  it('should allow authorized user to create a reservation', (done) => {
    chai.request(app)
      .post('/api/signup-token')
      .set('Accept', 'application/json')
      .set('Authorization', 'Bearer '.concat(master))
      .send({})
      .end((err, res) => {
        res.should.have.status(201);
        done();
      });
  });

  it('should not allow normal user to create a token', (done) => {
    chai.request(app)
      .post('/api/signup-token')
      .set('Accept', 'application/json')
      .set('Authorization', 'Bearer '.concat(user))
      .send({})
      .end((err, res) => {
        res.should.have.status(401);
        done();
      });
  });
});
