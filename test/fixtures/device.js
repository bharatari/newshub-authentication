module.exports = function (models) {
  return new Promise((resolve, reject) => {
    return models.device.destroy({ where: {} })
      .then(() => {
        resolve([
          {
            model: 'device',
            data: {
              name: 'Mixer 1 Tascam',
              label: 'MIXER 1 TASCAM',
              description: null,
              notes: null,
              type: 'Recorders',
              meta: null,
              quantity: 1,
              disabled: false,
            },
          },
          {
            model: 'device',
            data: {
              name: 'Zoom H4',
              label: 'Zoom 2',
              description: null,
              notes: 'Disabled Fall 2016',
              type: 'Recorders',
              meta: null,
              quantity: 1,
              disabled: true,
            },
          },
        ]);
      });
  });
};
