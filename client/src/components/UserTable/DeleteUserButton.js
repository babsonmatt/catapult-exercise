import React from 'react';
import PropTypes from 'prop-types';
import { Button, Icon, Modal } from 'semantic-ui-react';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import { userFragment } from '../../fragments/user';

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
      ...User
    }
  }
  ${userFragment}
`;

class DeleteUserButton extends React.Component {
  static propTypes = {
    user: PropTypes.object.isRequired,
    filter: PropTypes.string,
  };

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

export default DeleteUserButton;
