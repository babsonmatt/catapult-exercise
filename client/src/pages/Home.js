import React from 'react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import { Container, Header } from 'semantic-ui-react';
import UserChart from '../components/UserChart';

const CURRENT_USER_QUERY = gql`
  {
    currentUser {
      id
      firstName
      lastName
      email
      results
    }
  }
`;

const HomePage = () => (
  <Query query={CURRENT_USER_QUERY}>
    {({ loading, error, data }) => {
      if (loading) return <p>Loading...</p>;
      if (error) return <p>Error :(</p>;
      const { currentUser } = data;
      return (
        <Container>
          <Header as="h1">
            Welcome, {currentUser.firstName} {currentUser.lastName}
          </Header>
          <UserChart
            data={currentUser.results}
            name={`${currentUser.firstName} ${currentUser.lastName}`}
          />
        </Container>
      );
    }}
  </Query>
);

export default HomePage;
