import React from 'react';
import PropTypes from 'prop-types';
import { Button, Container, Form, Header, Message } from 'semantic-ui-react';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import { userFragment } from '../fragments/user';
import { isValidationError } from '../helpers/validation';

export const SIGNIN_MUTATION = gql`
  mutation($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      currentUser {
        ...User
      }
    }
  }
  ${userFragment}
`;

const CURRENT_USER_QUERY = gql`
  {
    currentUser {
      ...User
    }
  }
  ${userFragment}
`;

class SignInPage extends React.Component {
  static propTypes = {
    history: PropTypes.object.isRequired,
  };

  state = {
    email: '',
    password: '',
    error: '',
  };

  handleChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  render() {
    const { history } = this.props;

    return (
      <Container
        style={{
          height: '80vh',
          display: 'flex',
        }}
      >
        <Mutation
          mutation={SIGNIN_MUTATION}
          update={(cache, { data: { login } }) => {
            cache.writeQuery({
              query: CURRENT_USER_QUERY,
              data: {
                currentUser: login.currentUser,
              },
            });
          }}
        >
          {(signIn, { loading, error }) => (
            <Form
              error={this.state.error ? true : false}
              onSubmit={async () => {
                try {
                  const result = await signIn({
                    variables: {
                      email: this.state.email,
                      password: this.state.password,
                    },
                  });
                  localStorage.authToken = result.data.login.token;
                  history.push('/home');
                } catch (e) {
                  if (isValidationError(e)) {
                    this.setState({
                      error: 'Invalid Email and/or Password',
                    });
                  } else {
                    this.setState({
                      error: 'Something went wrong. Please try again!',
                    });
                  }
                }
              }}
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <Header as="h1">Sign In</Header>
              <Message error header="Woops!" content={this.state.error} />
              <Form.Field>
                <label>Email</label>
                <input
                  name="email"
                  placeholder="Email"
                  onChange={this.handleChange}
                />
              </Form.Field>
              <Form.Field>
                <label>Password</label>
                <input
                  name="password"
                  placeholder="Password"
                  type="password"
                  onChange={this.handleChange}
                />
              </Form.Field>
              <Button type="submit" loading={loading}>
                Sign In
              </Button>
            </Form>
          )}
        </Mutation>
      </Container>
    );
  }
}

export default SignInPage;
