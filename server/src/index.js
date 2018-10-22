import { ApolloServer, gql } from 'apollo-server';
import * as yup from 'yup';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { knex } from './db';

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
    signup: async (root, { input }, context) => {
      const token = 'abc';
      const loginUser = {
        firstName: 'matt',
        email: 'matt@matt.com',
      };
      return { token, currentUser: loginUser };
    },
  },
};

const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
