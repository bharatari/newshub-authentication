const Sequelize = require('sequelize');

module.exports = function (app) {
  let sequelize;
  let ssl;

  if (app.get('DATABASE_SSL') === 'true') {
    ssl = true;
  } else {
    ssl = false;
  }

  sequelize = new Sequelize(app.get('postgres'), {
    dialect: 'postgres',
    logging: false,
    dialectOptions: {
      ssl,
    },
  });
  

  app.set('sequelize', sequelize);

  const oldSetup = app.setup;
  
  app.setup = function (...args) {
    const result = oldSetup.apply(this, args);

    // Set up data relationships
    const models = sequelize.models;

    Object.keys(models).forEach(name => {
      if ('associate' in models[name]) {
        models[name].associate(models);
      }
    });

    // Sync to the database
    sequelize.sync();

    return result;
  };
};
