import { ApolloServer, gql, ForbiddenError } from 'apollo-server';
import * as yup from 'yup';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import eachDay from 'date-fns/each_day';
// import GraphQLJSON from 'graphql-type-json';
import { knex } from './db';
import { validate } from './helpers/validation';

const secret = 'secret';

const typeDefs = gql`
  scalar JSON

  type User {
    id: ID!
    firstName: String!
    lastName: String!
    email: String!
    results: JSON
  }

  type Auth {
    token: String
    currentUser: User
  }

  input SignupInput {
    email: String!
    password: String!
    firstName: String!
    lastName: String!
  }

  type Query {
    me: User
    user(id: ID!): User
    users(filter: String): [User]
  }

  type Mutation {
    login(email: String!, password: String!): Auth
    signup(input: SignupInput!): Auth
    deleteUser(id: ID!): User
  }
`;

const resolvers = {
  Query: {
    me: async (root, args, context) => {
      if (!context.user) {
        throw new ForbiddenError('You need to be authenticated!');
      }
      const user = await knex('users')
        .where('id', context.user.id)
        .first();
      return user;
    },
    user: async (root, { id }, context) => {
      const user = await knex('users')
        .where('id', id)
        .first();
      return user;
    },
    users: async (root, { filter }, context) => {
      const q = knex('users');
      if (filter) {
        const strippedFilter = filter.replace(/%/g, '');
        q.where('firstName', 'like', `%${strippedFilter}%`)
          .orWhere('lastName', 'like', `%${strippedFilter}%`)
          .orWhere('email', 'like', `%${strippedFilter}%`);
      }
      const users = await q;
      return users;
    },
  },
  User: {
    results: async user => {
      return knex('users_results')
        .select('timestamp', 'result')
        .where('userId', user.id);
    },
  },
  Mutation: {
    deleteUser: async (root, { id }, context) => {
      const user = await knex('users')
        .where('id', id)
        .first();
      await knex.transaction(async trx => {
        await knex('users')
          .transacting(trx)
          .where('id', id)
          .del();
        await knex('users_results')
          .transacting(trx)
          .where('userId', id)
          .del();
      });
      return user;
    },
    login: async (root, { email, password }, context) => {
      const loginUser = await knex('users')
        .where('email', email)
        .first();

      const schema = yup.object().shape({
        password: yup
          .string()
          .required('Please enter your password')
          .test('auth', 'Invalid Email and/or Password', async () => {
            if (!loginUser) return false;
            const auth = await bcrypt.compare(password, loginUser.password);
            return auth;
          }),
        email: yup
          .string()
          .email()
          .required('Please enter your email address'),
      });

      await validate(schema, { email, password });

      const token = jwt.sign({ user: loginUser }, secret, {
        expiresIn: '24h',
      });

      return { token, currentUser: loginUser };
    },
    signup: async (root, { input }, context) => {
      const { email, password, firstName, lastName } = input;

      const schema = yup.object().shape({
        firstName: yup.string().required('Please enter your first name'),
        lastName: yup.string().required('Please enter your last name'),
        email: yup
          .string()
          .email()
          .required('Please enter your email address')
          .test('uniqueEmail', 'Email already exists!', async () => {
            const emailQuery = await knex('users')
              .where('email', email)
              .select('email');
            return emailQuery.length === 0;
          }),
        password: yup
          .string()
          .required('Please enter your password')
          .min(8, 'Password must be at least 8 characters'),
      });

      await validate(schema, { email, password, firstName, lastName });

      const newUserId = await knex.transaction(async trx => {
        const userId = await knex('users')
          .transacting(trx)
          .insert({
            firstName,
            lastName,
            email,
            password: await bcrypt.hash(password, 10),
          });

        // generate some user result data
        const result = eachDay(new Date(2018, 8, 1), new Date(2018, 8, 30));
        const userResults = result.map(date => ({
          userId,
          timestamp: date.getTime() / 1000,
          result: Math.floor(Math.random() * (40 - 15)) + 15,
        }));

        await knex('users_results')
          .transacting(trx)
          .insert(userResults);

        return userId;
      });

      const loginUser = {
        id: newUserId[0],
        firstName,
        lastName,
        email,
      };

      const token = jwt.sign({ user: loginUser }, secret, { expiresIn: '24h' });

      return { token, currentUser: loginUser };
    },
  },
};

const context = ({ req }) => {
  const token = req.headers.authorization.split(' ')[1];
  const data = jwt.verify(token, 'secret');
  const user = data.user;
  return { user };
};

const server = new ApolloServer({ typeDefs, resolvers, context });

server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
