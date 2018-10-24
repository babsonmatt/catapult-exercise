import React from 'react';
import PropTypes from 'prop-types';
import { Button, Table, Icon, Modal } from 'semantic-ui-react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import UserChart from '../../components/UserChart';
import DeleteUserButton from './DeleteUserButton';
import { userFragment } from '../../fragments/user';

export const GET_USERS_QUERY = gql`
  query($filter: String) {
    users(filter: $filter) {
      ...User
    }
  }
  ${userFragment}
`;

const UserTable = ({ filter }) => (
  <Query query={GET_USERS_QUERY} variables={{ filter }}>
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
                  <DeleteUserButton user={user} filter={filter} />
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      );
    }}
  </Query>
);

UserTable.propTypes = {
  filter: PropTypes.string,
};

export default UserTable;
