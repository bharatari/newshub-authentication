'use strict';

const assert = require('assert');
const app = require('../../../src/app');
const chai = require('chai');
const chaiHttp = require('chai-http');
const authentication = require('@feathersjs/authentication-client');
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

describe('user service', () => {
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

  it('registered the user service', () => {
    assert.ok(app.service('/api/user'));
  });

  it('should allow creation of a new account with valid signup token', (done) => {
    chai.request(app)
      .post('/api/user')
      .set('Accept', 'application/json')
      .send({
        firstName: 'New',
        lastName: 'User',
        password: 'password',
        email: 'email@nothing.com',
        username: 'newuser',
        signupToken: 'TOKEN_1'
      })
      .end((err, res) => {
        res.should.have.status(201);
        done();
      });
  });

  it('created user should have organization properties set', (done) => {
    chai.request(app)
      .post('/api/user')
      .set('Accept', 'application/json')
      .send({
        firstName: 'New',
        lastName: 'User',
        password: 'password',
        email: 'email2@nothing.com',
        username: 'newuser2',
        signupToken: 'TOKEN_2'
      })
      .end(async (err, res) => {
        res.body.should.have.property('currentOrganizationId');
        res.should.have.status(201);

        const user = await app.get('sequelize').models.user.findOne({
          where: {
            id: res.body.id,
          },
          include: [{
            model: app.get('sequelize').models.organization
          }]
        });

        user.should.have.property('organizations');
        
        done();
      });
  });

  it('should allow for editing multiple protected fields at once', () => {

  });

  it('should allow editing for roles for authorized users', async (done) => {
    const user = await app.get('sequelize').models.user.findOne({
      where: {
        username: 'editroles',
      },
    });

    chai.request(app)
      .patch(`/api/user/${user.id}`)
      .set('Accept', 'application/json')
      .set('Authorization', 'Bearer '.concat(master))
      .send({
        roles: 'admin'
      })
      .end(async (err, res) => {
        res.should.have.status(200);

        const updatedUser = await app.get('sequelize').models.user.findOne({
          where: {
            id: user.id,
          },
          include: [{
            model: app.get('sequelize').models.organization,
            where: {
              '$organizations.organization_user.organizationId$': user.currentOrganizationId,
            },
          }]
        });

        assert.equal(updatedUser.organizations[0].organization_user.roles, 'admin');

        done();
      });
  });

  it('should allow admin to add users to organization', async (done) => {
    const models = app.get('sequelize').models;

    const user = await models.user.findOne({
      where: {
        username: 'editorganizations',
      },
    });

    const organization = await models.organization.findOne({
      where: {
        name: 'utdtv',
      },
    });

    chai.request(app)
      .patch(`/api/user/${user.id}`)
      .set('Accept', 'application/json')
      .set('Authorization', 'Bearer '.concat(master))
      .send({
        organizationId: organization.id,
      })
      .end(async (err, res) => {
        res.should.have.status(200);

        done();
      });
  });
});
