import React from 'react';
import { Container, Header } from 'semantic-ui-react';
import { ResponsiveLine } from '@nivo/line';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import format from 'date-fns/format';

const UserChart = ({ data, name }) => {
  const formattedData = [
    {
      id: name,
      data: data.map(d => ({
        x: format(new Date(d.timestamp * 1000), 'MM/DD/YYYY'),
        y: d.result,
      })),
    },
  ];
  return (
    <div style={{ height: 300 }}>
      <ResponsiveLine
        data={formattedData}
        minY="auto"
        maxY="auto"
        axisBottom={{
          orient: 'bottom',
          tickSize: 5,
          tickPadding: 5,
          tickRotation: -45,
          legendOffset: 36,
          legendPosition: 'center',
        }}
        axisLeft={{
          orient: 'left',
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: 'minutes',
          legendOffset: -40,
          legendPosition: 'center',
        }}
        margin={{
          top: 20,
          right: 20,
          bottom: 60,
          left: 80,
        }}
      />
    </div>
  );
};

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
