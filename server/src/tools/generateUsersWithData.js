import faker from 'faker';
import bcrypt from 'bcrypt';
import flatten from 'lodash/flatten';
import eachDay from 'date-fns/each_day';
import { knex } from '../db';

const generateData = userId => {
  const result = eachDay(new Date(2018, 8, 1), new Date(2018, 8, 30));
  const userResults = result.map(date => ({
    userId,
    timestamp: date.getTime() / 1000,
    result: Math.floor(Math.random() * (40 - 15)) + 15,
  }));
  return userResults;
};

const generateUsersWithData = async () => {
  const userInsertPromises = [];
  for (let i = 0; i < 10; i++) {
    const firstName = faker.name.firstName();
    const lastName = faker.name.lastName();
    const email = faker.internet.email();
    const password = await bcrypt.hash('password', 10);
    userInsertPromises.push(
      knex('users').insert({
        firstName,
        lastName,
        email,
        password,
      }),
    );
  }

  const newUserIds = flatten(await Promise.all(userInsertPromises));
  const userData = flatten(newUserIds.map(userId => generateData(userId)));

  await knex('users_results').insert(userData);
  knex.destroy();
};

generateUsersWithData();
