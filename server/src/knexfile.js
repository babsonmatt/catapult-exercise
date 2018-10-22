const config = {};

config.development = {
  client: 'sqlite3',
  connection: {
    filename: './src/data/catapult.db',
  },
  seeds: {
    directory: './seeds',
  },
  migrations: {
    tableName: 'migrations',
    directory: './migrations',
  },
  debug: true,
};

// config.development = {
//   client: 'pg',
//   connection: {
//     host: 'localhost',
//     user: 'postgres',
//     database: 'catapult',
//     charset: 'utf8',
//   },
//   pool: {
//     min: 2,
//     max: 10,
//   },
//   seeds: {
//     directory: './seeds',
//   },
//   migrations: {
//     tableName: 'migrations',
//     directory: './migrations',
//   },
//   debug: true,
// };

module.exports = config;
