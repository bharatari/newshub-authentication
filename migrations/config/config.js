const env = process.env.NODE_ENV || 'development';

module.exports = {
  [env]: {
    url: process.env.DATABASE_URL,
    dialect: 'postgres',
    migrationStorageTableName: '_migrations',
    dialectOptions: {
      ssl: (env === 'development') ? false : true,
    },
  }
};
