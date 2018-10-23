import React from 'react';
import {
  Button,
  Container,
  Header,
  Table,
  Icon,
  Modal,
  Input,
} from 'semantic-ui-react';
import { Query, Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import debounce from 'lodash/debounce';
import UserChart from '../components/UserChart';

const DELETE_USER_MUTATION = gql`
  mutation DeleteUser($id: ID!) {
    deleteUser(id: $id) {
      id
    }
  }
`;

const GET_USERS_QUERY = gql`
  query($filter: String) {
    users(filter: $filter) {
      id
      firstName
      lastName
      email
      results
    }
  }
`;

class DeleteUserButton extends React.Component {
  state = {
    open: false,
  };

  handleOpenModal = () => {
    this.setState({ open: true });
  };

  handleCloseModal = () => {
    this.setState({ open: false });
  };

  render() {
    const { user, filter } = this.props;
    return (
      <React.Fragment>
        <Button size="mini" color="red" onClick={this.handleOpenModal} icon>
          <Icon name="delete" />
        </Button>
        <Modal size="mini" open={this.state.open}>
          <Modal.Header>
            Delete {user.firstName} {user.lastName}?
          </Modal.Header>
          <Modal.Content>
            <p>
              Are you sure you want to delete {user.firstName} {user.lastName}?
            </p>
          </Modal.Content>
          <Modal.Actions>
            <Button onClick={this.handleCloseModal} negative>
              No
            </Button>
            <Mutation
              key={user.id}
              mutation={DELETE_USER_MUTATION}
              update={(cache, { data: { deleteUser } }) => {
                const { users } = cache.readQuery({
                  query: GET_USERS_QUERY,
                  variables: { filter },
                });
                cache.writeQuery({
                  query: GET_USERS_QUERY,
                  variables: { filter },
                  data: {
                    users: users.filter(user => user.id !== deleteUser.id),
                  },
                });
              }}
            >
              {(deleteUser, { data }) => (
                <Button
                  positive
                  icon="checkmark"
                  labelPosition="right"
                  content="Yes"
                  onClick={() => {
                    deleteUser({ variables: { id: user.id } });
                    this.handleCloseModal();
                  }}
                />
              )}
            </Mutation>
          </Modal.Actions>
        </Modal>
      </React.Fragment>
    );
  }
}

const UsersTable = ({ filter }) => (
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

class ManagePage extends React.Component {
  state = {
    filter: null,
  };

  handleFilterChangeDebounced = debounce(filter => {
    this.setState({ filter });
  }, 300);

  render() {
    const { filter } = this.state;
    return (
      <Container>
        <Header as="h1">Manage Users</Header>
        <Input
          focus
          placeholder="Search..."
          onChange={e => this.handleFilterChangeDebounced(e.target.value)}
        />
        <UsersTable filter={filter} />
      </Container>
    );
  }
}

export default ManagePage;
