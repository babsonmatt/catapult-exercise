import React from 'react';
import {
  Button,
  Container,
  Header,
  Table,
  Icon,
  Modal,
} from 'semantic-ui-react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import UserChart from '../components/UserChart';

const UserChartModal = () => (
  <Modal trigger={<Button>Show Modal</Button>}>
    <Modal.Header>Select a Photo</Modal.Header>
    <Modal.Content>
      <Modal.Description>
        <Header>Default Profile Image</Header>
        <p>
          We've found the following gravatar image associated with your e-mail
          address.
        </p>
        <p>Is it okay to use this photo?</p>
      </Modal.Description>
    </Modal.Content>
  </Modal>
);

const Users = () => (
  <Query
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

      return (
        <Table celled striped>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>First Name</Table.HeaderCell>
              <Table.HeaderCell>Last Name </Table.HeaderCell>
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
                  <Modal
                    trigger={
                      <Button size="mini" icon>
                        <Icon name="chart line" />
                      </Button>
                    }
                  >
                    <Modal.Header>
                      {user.firstName} {user.lastName}
                      's Chart
                    </Modal.Header>
                    <Modal.Content>
                      <Modal.Description>
                        <UserChart
                          data={user.results}
                          name={`${user.firstName} ${user.lastName}`}
                        />
                      </Modal.Description>
                    </Modal.Content>
                  </Modal>
                  <Button size="mini" color="red" icon>
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
