module.exports = function (models) {
  return new Promise((resolve, reject) => {
    return models.reservation.destroy({ where: {} })
      .then(() => {
        resolve([
          {
            model: 'reservation',
            data: {
              purpose: 'Video Shoot',
              notes: '',
              startDate: '2016-09-03 00:00:00+00',
              endDate: '2016-09-07 00:00:00+00',
              meta: {},
              approved: false,
              checkedOut: false,
              checkedIn: false,
              disabled: false,
            },
          },
        ]);
      });
  });
};
