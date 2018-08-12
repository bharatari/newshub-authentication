'use strict';

const assert = require('assert');
const app = require('../../../src/app');
const chai = require('chai');

const should = chai.should();
  
describe('resetPassword service', () => {
  it('registered the resetPassword service', () => {
    assert.ok(app.service('/api/reset-password'));
  });

  it('creates reset token for valid email', (done) => {
    chai.request(app)
      .post('/api/reset-password')
      .set('Accept', 'application/json')
      .send({
        email: 'normal'
      })
      .end((err, res) => {
        res.should.have.status(201);
        done();
      });
  });

  it('does not create reset token for invalid email', (done) => {
    chai.request(app)
      .post('/api/reset-password')
      .set('Accept', 'application/json')
      .send({
        email: 'fake@email.com'
      })
      .end((err, res) => {
        res.should.have.status(400);
        done();
      });
  });

  it('resets password for valid token and email', (done) => {
    const models = app.get('sequelize').models;
    
    chai.request(app)
      .post('/api/reset-password')
      .set('Accept', 'application/json')
      .send({
        email: 'normal'
      })
      .end((err, res) => {
        models.resetPasswordToken.findOne({
          where: {
            email: 'normal',
            used: false,
          },
          order: [
            ['createdAt', 'DESC'],
          ],
        }).then((token) => {
          const data = JSON.parse(JSON.stringify(token));

          chai.request(app)
            .patch('/api/reset-password')
            .set('Accept', 'application/json')
            .send({
              email: 'normal',
              password: 'password',
              resetToken: data.token,
            })
            .end((err, res) => {
              res.should.have.status(200);
              done();
            });
        }).catch((err) => {
          throw err;
        });
      });
  });

  it('does not reset password for invalid token and valid email', (done) => {
    const models = app.get('sequelize').models;

    chai.request(app)
      .post('/api/reset-password')
      .set('Accept', 'application/json')
      .send({
        email: 'normal'
      })
      .end((err, res) => {
        models.resetPasswordToken.findOne({
          where: {
            email: 'normal',
            used: false,
          },
        }).then((token) => {
          const data = JSON.parse(JSON.stringify(token));

          chai.request(app)
            .patch('/api/reset-password')
            .set('Accept', 'application/json')
            .send({
              email: 'fake@user.com',
              password: 'password',
              resetToken: data.token,
            })
            .end((err, res) => {
              res.should.have.status(400);
              done();
            });
        }).catch((err) => {
          throw err;
        });
      });
  });

  it('does not reset password for invalid token and invalid email', (done) => {
    chai.request(app)
      .patch('/api/reset-password')
      .set('Accept', 'application/json')
      .send({
        email: 'fake@email.com',
        password: 'password',
        resetToken: '',
      })
      .end((err, res) => {
        res.should.have.status(400);
        done();
      });
  });

  it('does not reset password for expired token', (done) => {
    chai.request(app)
      .patch('/api/reset-password')
      .set('Accept', 'application/json')
      .send({
        email: 'normal',
        password: 'password',
        resetToken: '3jd9dvszu',
      })
      .end((err, res) => {
        res.should.have.status(400);
        done();
      });
  });

  it('does not reset password for used token', (done) => {
    chai.request(app)
      .patch('/api/reset-password')
      .set('Accept', 'application/json')
      .send({
        email: 'normal',
        password: 'password',
        resetToken: '2jdedvszu',
      })
      .end((err, res) => {
        res.should.have.status(400);
        done();
      });
  });
});
