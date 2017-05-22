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
