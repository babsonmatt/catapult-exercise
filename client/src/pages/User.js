import React from 'react';
import { Container, Header } from 'semantic-ui-react';

import { Query } from 'react-apollo';
import gql from 'graphql-tag';

const User = ({ userId }) => (
  <Query
    variables={{ userId: 1 }}
    query={gql`
      {
        users {
          id
          firstName
          lastName
          email
          results
        }
      }
    `}
  >
    {({ loading, error, data }) => {
      if (loading) return <p>Loading...</p>;
      if (error) return <p>Error :(</p>;

      return <div>hi</div>;
    }}
  </Query>
);

const UserPage = () => (
  <Container>
    <Header>User XYZ</Header>
    <User userId="1" />
  </Container>
);

export default UserPage;
