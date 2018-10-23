import React from 'react';
import { Container, Header } from 'semantic-ui-react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import UserChart from '../components/UserChart';

const User = ({ userId }) => (
  <Query
    variables={{ userId }}
    query={gql`
      query User($userId: ID!) {
        user(id: $userId) {
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

      return (
        <React.Fragment>
          <Header>
            {data.user.firstName} {data.user.lastName}
          </Header>
          <UserChart
            data={data.user.results}
            name={`${data.user.firstName} ${data.user.lastName}`}
          />
        </React.Fragment>
      );
    }}
  </Query>
);

const UserPage = () => (
  <Container>
    <User userId="1" />
  </Container>
);

export default UserPage;
