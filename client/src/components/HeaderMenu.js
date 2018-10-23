import React from 'react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import { withRouter } from 'react-router';
import { Menu } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

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

const shouldSkip = () => !localStorage.getItem('authToken');

class HeaderMenu extends React.Component {
  render() {
    return (
      <Query query={CURRENT_USER_QUERY} skip={shouldSkip()}>
        {({ client, loading, error, data }) => {
          let loggedIn = false;
          if (loading) return null;
          if (error) return null;
          if (data) loggedIn = true;

          return (
            <React.Fragment>
              <Menu>
                {!loggedIn && (
                  <Menu.Item name="signup">
                    <Link to="/signup">Sign Up</Link>
                  </Menu.Item>
                )}
                {loggedIn ? (
                  <Menu.Item name="signout">
                    <Link
                      to="/signout"
                      onClick={e => {
                        const { history } = this.props;
                        e.preventDefault();
                        localStorage.removeItem('authToken');
                        client.resetStore();
                        history.push('/signin');
                      }}
                    >
                      Sign Out
                    </Link>
                  </Menu.Item>
                ) : (
                  <Menu.Item name="signin">
                    <Link to="/signin">Sign In</Link>
                  </Menu.Item>
                )}
                {loggedIn && (
                  <Menu.Item name="home">
                    <Link to="/home">Home</Link>
                  </Menu.Item>
                )}
                <Menu.Item name="manage">
                  <Link to="/manage">Manage Users</Link>
                </Menu.Item>
                {data && (
                  <Menu.Menu position="right">
                    <Menu.Item>Hi, {data.currentUser.firstName}!</Menu.Item>
                  </Menu.Menu>
                )}
              </Menu>
              {this.props.children}
            </React.Fragment>
          );
        }}
      </Query>
    );
  }
}

export default withRouter(HeaderMenu);
