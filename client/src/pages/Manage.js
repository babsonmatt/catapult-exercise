import React from 'react';
import { Container, Header, Input } from 'semantic-ui-react';
import debounce from 'lodash/debounce';
import UserTable from '../components/UserTable';

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
        <UserTable filter={filter} />
      </Container>
    );
  }
}

export default ManagePage;
