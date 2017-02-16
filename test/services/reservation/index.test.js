'use strict';

const assert = require('assert');
const app = require('../../../src/app');
const chai = require('chai');
const chaiHttp = require('chai-http');
const authentication = require('feathers-authentication/client');
const bodyParser = require('body-parser');

app
  .use(bodyParser.json())
  .use(bodyParser.urlencoded({ extended: true }))
  .configure(authentication());

chai.use(chaiHttp);

const should = chai.should();

describe('reservation service', () => {
  before((done) => {
    this.server = app.listen(3030);

    this.server.once('listening', () => done());
  });

  after((done) => {
    this.server.close(() => {
      done();
    });
  });

  it('registered the reservation service', () => {
    assert.ok(app.service('/api/reservation'));
  });
});
