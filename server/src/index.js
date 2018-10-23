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
      const loginUser = {
        id: 1,
        email: 'a@a.com',
        firstName: 'matt',
        lastName: 'd',
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
