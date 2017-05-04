const env = process.env.NODE_ENV || 'development';

module.exports = {
  [env]: {
    username: "postgres",
    password: "postgres",
    database: "newshub_server_development",
    url: process.env.DATABASE_URL,
    dialect: 'postgres',
    migrationStorageTableName: '_migrations'
  }
};
