module.exports = function (models) {
  return new Promise(async (resolve, reject) => {
    const user = await models.user.findOne({
      where: {
        username: 'admin',
      },
    });

    const mercuryUser = await models.user.findOne({
      where: {
        username: 'mercury',
      },
    });

    const ownerDenyReservation = await models.user.findOne({
      where: {
        username: 'ownerdenyreservation',
      },
    });

    const ownerDenyReservationProperty = await models.user.findOne({
      where: {
        username: 'ownerdenyreservationproperty',
      },
    });

    const utdtv = await models.organization.findOne({
      where: {
        name: 'utdtv',
      },
    });

    const mercury = await models.organization.findOne({
      where: {
        name: 'themercury',
      },
    });

    return models.reservation.destroy({ where: {} })
      .then(() => {
        resolve([
          {
            model: 'reservation',
            data: {
              purpose: 'Video Shoot',
              notes: 'VIDEO_SHOOT',
              startDate: '2016-09-03 00:00:00+00',
              endDate: '2016-09-07 00:00:00+00',
              meta: {},
              approved: false,
              checkedOut: false,
              checkedIn: false,
              disabled: false,
              userId: user.id,
              organizationId: utdtv.id,
            },
          },
          {
            model: 'reservation',
            data: {
              purpose: 'Video Shoot',
              notes: 'VIDEO_SHOOT2',
              startDate: '2016-10-03 00:00:00+00',
              endDate: '2016-10-07 00:00:00+00',
              meta: {},
              approved: false,
              checkedOut: false,
              checkedIn: false,
              disabled: false,
              userId: user.id,
              organizationId: utdtv.id,
            },
          },
          {
            model: 'reservation',
            data: {
              purpose: 'Video Shoot',
              notes: 'VIDEO_SHOOT3',
              startDate: '2016-10-03 00:00:00+00',
              endDate: '2016-10-07 00:00:00+00',
              meta: {},
              approved: false,
              checkedOut: false,
              checkedIn: false,
              disabled: false,
              userId: ownerDenyReservation.id,
              organizationId: utdtv.id,
            },
          },
          {
            model: 'reservation',
            data: {
              purpose: 'Video Shoot',
              notes: 'VIDEO_SHOOT4',
              startDate: '2016-10-03 00:00:00+00',
              endDate: '2016-10-07 00:00:00+00',
              meta: {},
              approved: false,
              checkedOut: false,
              checkedIn: false,
              disabled: false,
              userId: ownerDenyReservationProperty.id,
              organizationId: utdtv.id,
            },
          },
          {
            model: 'reservation',
            data: {
              purpose: 'Video Shoot',
              notes: 'MERCURY',
              startDate: '2016-10-03 00:00:00+00',
              endDate: '2016-10-07 00:00:00+00',
              meta: {},
              approved: false,
              checkedOut: false,
              checkedIn: false,
              disabled: false,
              userId: mercuryUser.id,
              organizationId: mercury.id,
            },
          },
        ]);
      });
  });
};
