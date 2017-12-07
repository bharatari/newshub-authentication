'use strict';

const assert = require('assert');
const app = require('../../../src/app');
const chai = require('chai');
const _ = require('lodash');

let user;
let admin;
let master;
let mercury;

const should = chai.should();

describe('roomReservation service', function() {
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

                chai.request(app)
                  .post('/api/login')
                  .set('Accept', 'application/json')
                  .send({
                    strategy: 'local',
                    username: 'mercury',
                    password: 'password',
                  })
                  .end((err, res) => {
                    mercury = res.body.accessToken;

                    done();
                  });
              });
          });
      });
  });

  it('registered the roomReservation service', () => {
    assert.ok(app.service('/api/room-reservation'));
  });

  it('should allow user to create a reservation', async (done) => {
    const room = await app.get('sequelize').models.room.findOne({
      where: {
        label: 'STUDENT_MEDIA_SUITE_STUDIO', 
      },
    });

    chai.request(app)
      .post('/api/room-reservation')
      .set('Accept', 'application/json')
      .set('Authorization', 'Bearer '.concat(user))
      .send({
        roomId: room.id,
        startDate: '2017-02-01T01:00',
        endDate: '2017-03-01T13:00',
        purpose: 'News'
      })
      .end((err, res) => {
        res.should.have.status(201);
        done();
      });
  });

  it('should allow user to create a reservation with special requests', async (done) => {
    const room = await app.get('sequelize').models.room.findOne({
      where: {
        label: 'STUDENT_MEDIA_SUITE_STUDIO_2',
      },
    });

    chai.request(app)
      .post('/api/room-reservation')
      .set('Accept', 'application/json')
      .set('Authorization', 'Bearer '.concat(user))
      .send({
        roomId: room.id,
        startDate: '2017-02-01T01:00',
        endDate: '2017-03-01T13:00',
        purpose: 'News',
        specialRequests: 'Need special level of access to approve this'
      })
      .end((err, res) => {
        res.should.have.status(201);
        
        done();
      });
  });

  it('should allow authorized user to approve a reservation', async (done) => {
    const reservation = await app.get('sequelize').models.roomReservation.findOne({
      where: {
        notes: 'VIDEO_SHOOT',
      },
    });

    chai.request(app)
      .patch(`/api/room-reservation/${reservation.id}`)
      .set('Accept', 'application/json')
      .set('Authorization', 'Bearer '.concat(master))
      .send({
        approved: true,
      })
      .end((err, res) => {
        res.should.have.status(200);
        done();
      });
  });

  it('should not allow normal user to approve a reservation', async (done) => {
    const reservation = await app.get('sequelize').models.roomReservation.findOne({
      where: {
        notes: 'VIDEO_SHOOT2',
      },
    });

    chai.request(app)
      .patch(`/api/room-reservation/${reservation.id}`)
      .set('Accept', 'application/json')
      .set('Authorization', 'Bearer '.concat(user))
      .send({
        approved: true,
      })
      .end((err, res) => {
        res.should.have.status(401);
        done();
      });
  });

  it('should allow find requests', (done) => {
    chai.request(app)
      .get(`/api/room-reservation`)
      .set('Accept', 'application/json')
      .set('Authorization', 'Bearer '.concat(user))
      .end((err, res) => {
        res.should.have.status(200);

        done();
      });
  });

  it('should sort by start date', (done) => {
    chai.request(app)
      .get(`/api/room-reservation?$sort[startDate]=-1&$limit=10&$skip=0`)
      .set('Accept', 'application/json')
      .set('Authorization', 'Bearer '.concat(user))
      .end((err, res) => {
        res.should.have.status(200);

        const data = res.body.data;

        const sorted = _.every(data, (value, index, array) => {
          return index === 0 || new Date(array[index - 1].startDate) >= new Date(array[index].startDate);
        });

        sorted.should.equal(true);

        done();
      });
  });

  it('should sort by user without crashing', (done) => {
    chai.request(app)
      .get(`/api/room-reservation?$sort[user.fullName]=-1&$limit=10&$skip=0`)
      .set('Accept', 'application/json')
      .set('Authorization', 'Bearer '.concat(user))
      .end((err, res) => {
        res.should.have.status(200);

        done();
      });
  });

  it('should only return reservations in the same organization', async (done) => {
    const orgUser = await app.get('sequelize').models.user.findOne({
      where: {
        username: 'normal',
      },
    });

    chai.request(app)
      .get(`/api/room-reservation?$limit=10`)
      .set('Accept', 'application/json')
      .set('Authorization', 'Bearer '.concat(user))
      .end((err, res) => {
        res.should.have.status(200);

        const data = res.body.data;

        const inOrg = _.every(data, (value, index, array) => {
          if (value.organization.id === orgUser.currentOrganizationId) {
            return true;
          }

          return false;
        });

        inOrg.should.equal(true);

        done();
      });
  });

  it('should not return reservation that is not in organization', async (done) => {
    const reservation = await app.get('sequelize').models.roomReservation.findOne({
      where: {
        notes: 'VIDEO_SHOOT',
      },
    });

    chai.request(app)
      .get(`/api/room-reservation/${reservation.id}`)
      .set('Accept', 'application/json')
      .set('Authorization', 'Bearer '.concat(mercury))
      .end((err, res) => {
        res.should.have.status(401);

        done();
      });
  });
});
