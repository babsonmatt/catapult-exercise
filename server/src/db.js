import Knex from 'knex';
import knexConfig from './knexfile';
process.env.NODE_ENV =
  process.env.NODE_ENV === 'local' ? 'development' : process.env.NODE_ENV;

console.log(`ENV: ${process.env.NODE_ENV}`);
export const knex = Knex(knexConfig[process.env.NODE_ENV || 'development']);
