import React from 'react';
import {
  Button,
  Container,
  Form,
  Header,
  Table,
  Icon,
} from 'semantic-ui-react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';

const Users = () => (
  <Query
    query={gql`
      {
        users {
          id
          firstName
          lastName
          email
        }
      }
    `}
  >
    {({ loading, error, data }) => {
      if (loading) return <p>Loading...</p>;
      if (error) return <p>Error :(</p>;

      return (
        <Table celled striped>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>First Name</Table.HeaderCell>
              <Table.HeaderCell>Last Name</Table.HeaderCell>
              <Table.HeaderCell>Email</Table.HeaderCell>
              <Table.HeaderCell />
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {data.users.map(user => (
              <Table.Row key={user.id}>
                <Table.Cell>{user.firstName}</Table.Cell>
                <Table.Cell>{user.lastName}</Table.Cell>
                <Table.Cell>{user.email}</Table.Cell>
                <Table.Cell collapsing textAlign="right">
                  <Button size="mini" icon>
                    <Icon name="delete" />
                  </Button>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      );
    }}
  </Query>
);

const ManagePage = () => (
  <Container>
    <Header as="h1">Manage Users</Header>
    <Users />
  </Container>
);

export default ManagePage;
