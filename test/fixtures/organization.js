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
              defaultRoles: '',
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
        ]);
      });
  });
};
