import { ApolloServer, gql } from 'apollo-server';
import * as yup from 'yup';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { knex } from './db';
import { validate } from './helpers/validation';

const secret = 'secret';

const typeDefs = gql`
  type User {
    id: ID!
    firstName: String!
    lastName: String!
    email: String!
  }

  type Auth {
    token: String
    currentUser: User
  }

  type Book {
    title: String
    author: String
  }

  input SignupInput {
    email: String!
    password: String!
    firstName: String!
    lastName: String!
  }

  type Query {
    books: [Book]
    users: [User]
  }

  type Mutation {
    login(email: String!, password: String!): Auth
    signup(input: SignupInput!): Auth
  }
`;

const resolvers = {
  Query: {
    users: async () => {
      const users = await knex.select('*').from('users');
      return users;
    },
  },
  Mutation: {
    login: async (root, { email, password }, context) => {
      const loginUser = await knex('users')
        .where('email', email)
        .first();

      const schema = yup.object().shape({
        password: yup
          .string()
          .required('Please enter your password')
          .min(8, 'Password must be at least 8 characters')
          .test('auth', 'Invalid Email and/or Password', async () => {
            if (!loginUser) return false;
            const auth = await bcrypt.compare(password, loginUser.password);
            // if (!auth) throw new AuthenticationError('must authenticate');
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

      debugger;

      const newUserId = await knex.transaction(async trx => {
        const userId = await knex('users')
          .transacting(trx)
          .insert({
            firstName,
            lastName,
            email,
            password: await bcrypt.hash(password, 10),
          });
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

const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
