'use strict';

const assert = require('assert');
const app = require('../../../src/app');
const chai = require('chai');
const _ = require('lodash');

let user;
let admin;
let master;
let mercury;
let special;

const should = chai.should();

describe('reservation service', () => {
  before(async (done) => {
    const normalUser = await chai.request(app)
      .post('/api/login')
      .set('Accept', 'application/json')
      .send({
        strategy: 'local',
        username: 'normal',
        password: 'password',
      });

    user = normalUser.body.accessToken;
    
    const adminUser = await chai.request(app)
      .post('/api/login')
      .set('Accept', 'application/json')
      .send({
        strategy: 'local',
        username: 'admin',
        password: 'password',
      });

    admin = adminUser.body.accessToken;
      
    const masterUser = await chai.request(app)
      .post('/api/login')
      .set('Accept', 'application/json')
      .send({
        strategy: 'local',
        username: 'master',
        password: 'password',
      });

    master = masterUser.body.accessToken;
        
    const mercuryUser = await chai.request(app)
      .post('/api/login')
      .set('Accept', 'application/json')
      .send({
        strategy: 'local',
        username: 'mercury',
        password: 'password',
      });

    mercury = mercuryUser.body.accessToken;

    const specialUser = await chai.request(app)
      .post('/api/login')
      .set('Accept', 'application/json')
      .send({
        strategy: 'local',
        username: 'approvespecial',
        password: 'password',
      });
    
    special = specialUser.body.accessToken;

    done();
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
        devices: [{
          id: device.id,
          availableQuantity: 1,
          reservedQuantity: 1
        }],
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
    const device = await app.get('sequelize').models.device.findOne();

    chai.request(app)
      .post('/api/reservation')
      .set('Accept', 'application/json')
      .set('Authorization', 'Bearer '.concat(user))
      .send({
        devices: [{
          id: device.id,
          availableQuantity: 1,
          reservedQuantity: 1
        }],
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
    const reservation = await app.get('sequelize').models.reservation.findOne({
      where: {
        notes: 'VIDEO_SHOOT',
      },
    });

    chai.request(app)
      .patch(`/api/reservation/${reservation.id}`)
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
    const reservation = await app.get('sequelize').models.reservation.findOne({
      where: {
        notes: 'VIDEO_SHOOT2',
      },
    });

    chai.request(app)
      .patch(`/api/reservation/${reservation.id}`)
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

  it('should not allow user to approve reservation with special requests without appropriate access', async (done) => {
    const reservation = await app.get('sequelize').models.reservation.findOne({
      where: {
        notes: 'SPECIAL_REQUESTS',
      },
    });

    chai.request(app)
      .patch(`/api/reservation/${reservation.id}`)
      .set('Accept', 'application/json')
      .set('Authorization', 'Bearer '.concat(admin))
      .send({
        approved: true,
      })
      .end((err, res) => {
        res.should.have.status(401);

        done();
      });
  });

  it('should allow authorized user to approve a reservation with special requests', async (done) => {
    const reservation = await app.get('sequelize').models.reservation.findOne({
      where: {
        notes: 'SPECIAL_REQUESTS',
      },
    });

    chai.request(app)
      .patch(`/api/reservation/${reservation.id}`)
      .set('Accept', 'application/json')
      .set('Authorization', 'Bearer '.concat(special))
      .send({
        approved: true,
      })
      .end((err, res) => {
        res.should.have.status(200);

        done();
      });
  });

  it('should not allow user to approve a special approval reservation without appropriate access', async (done) => {
    const reservation = await app.get('sequelize').models.reservation.findOne({
      where: {
        notes: 'SPECIAL',
      },
    });

    chai.request(app)
      .patch(`/api/reservation/${reservation.id}`)
      .set('Accept', 'application/json')
      .set('Authorization', 'Bearer '.concat(admin))
      .send({
        approved: true,
      })
      .end((err, res) => {
        res.should.have.status(401);

        done();
      });
  });

  it('should allow authorized user to approve a reservation with special approval', async (done) => {
    const reservation = await app.get('sequelize').models.reservation.findOne({
      where: {
        notes: 'SPECIAL',
      },
    });

    chai.request(app)
      .patch(`/api/reservation/${reservation.id}`)
      .set('Accept', 'application/json')
      .set('Authorization', 'Bearer '.concat(special))
      .send({
        approved: true,
      })
      .end((err, res) => {
        res.should.have.status(200);

        done();
      });
  });

  it('should allow authorized user to check out a reservation', () => {

  });

  it('should not allow normal user to check out a reservation', () => {

  });

  it('should allow authorized user to check in a reservation', () => {

  });

  it('should not allow normal user to check in a reservation', () => {

  });

  it('should allow find requests', (done) => {
    chai.request(app)
      .get(`/api/reservation`)
      .set('Accept', 'application/json')
      .set('Authorization', 'Bearer '.concat(user))
      .end((err, res) => {
        res.should.have.status(200);

        done();
      });
  });

  it('should sort by start date', (done) => {
    chai.request(app)
      .get(`/api/reservation?$sort[startDate]=-1&$limit=10&$skip=0`)
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
      .get(`/api/reservation?$sort[user.fullName]=-1&$limit=10&$skip=0`)
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
      .get(`/api/reservation?$limit=10`)
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
    const reservation = await app.get('sequelize').models.reservation.findOne({
      where: {
        notes: 'VIDEO_SHOOT',
      },
    });

    chai.request(app)
      .get(`/api/reservation/${reservation.id}`)
      .set('Accept', 'application/json')
      .set('Authorization', 'Bearer '.concat(mercury))
      .end((err, res) => {
        res.should.have.status(401);

        done();
      });
  });
});
