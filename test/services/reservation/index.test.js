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

describe('reservation service', () => {
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

  it('registered the reservation service', () => {
    assert.ok(app.service('/api/reservation'));
  });

  it('should allow user to create a reservation', async (done) => {
    const device = await app.get('sequelize').models.device.findOne();

    chai.request(app)
      .post('/api/reservation')
      .set('Accept', 'application/json')
      .set('Authorization', 'Bearer '.concat(user))
      .send({
        "devices": [{
          "id": device.id,
          "availableQuantity": 1,
          "reservedQuantity": 1
        }],
        "startDate": "2017-02-01T01:00",
        "endDate": "2017-03-01T13:00",
        "purpose": "News"
      })
      .end((err, res) => {
        res.should.have.status(201);
        done();
      });
  });
});
