module.exports = function (models) {
  return new Promise((resolve, reject) => {
    return models.organization.destroy({ where: {} })
      .then(() => {
        resolve([
          {
            model: 'organization',
            data: {
              name: 'utdtv',
              label: 'UTD TV',
              link: 'http://www.utdtv.com',
              logo: 'http://www.utdtv.com',
              meta: {},
              defaultRoles: 'admin',
            },
          },
          {
            model: 'organization',
            data: {
              name: 'themercury',
              label: 'The Mercury',
              link: 'http://www.utdmercury.com',
              logo: 'http://www.utdmercury.com',
              meta: {},
              defaultRoles: '',
            },
          },
          {
            model: 'organization',
            data: {
              name: 'radio',
              label: 'Radio UTD',
              link: 'http://www.radioutd.com',
              logo: 'http://www.radioutd.com',
              meta: {},
              defaultRoles: 'roomReservation:create',
            },
          },
        ]);
      });
  });
};
