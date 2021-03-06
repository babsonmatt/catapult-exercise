import React from 'react';
import PropTypes from 'prop-types';
import { Button, Container, Form, Header, Message } from 'semantic-ui-react';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import { getValidationErrors } from '../helpers/validation';
import { userFragment } from '../fragments/user';

export const SIGNUP_MUTATION = gql`
  mutation signup($input: SignupInput!) {
    signup(input: $input) {
      token
      currentUser {
        ...User
      }
    }
  }
  ${userFragment}
`;

class SignUpPage extends React.Component {
  static propTypes = {
    history: PropTypes.object.isRequired,
  };

  state = {
    firstName: '',
    lastName: '',
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
        <Mutation mutation={SIGNUP_MUTATION}>
          {(signUp, { loading, error }) => (
            <Form
              error={this.state.error ? true : false}
              onSubmit={async () => {
                try {
                  const result = await signUp({
                    variables: {
                      input: {
                        firstName: this.state.firstName,
                        lastName: this.state.lastName,
                        email: this.state.email,
                        password: this.state.password,
                      },
                    },
                  });
                  localStorage.authToken = result.data.signup.token;
                  history.push('/home');
                } catch (e) {
                  const validationErrors = getValidationErrors(e);
                  if (validationErrors) {
                    // reduce over the validationErrors keys and set a single error
                    this.setState({
                      error: Object.keys(validationErrors).reduce(
                        (p, c) => validationErrors[c],
                        '',
                      ),
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
              <Header as="h1">Sign Up</Header>
              <Message error header="Woops!" content={this.state.error} />
              <Form.Field required>
                <label>First Name</label>
                <input
                  name="firstName"
                  placeholder="First Name"
                  onChange={this.handleChange}
                />
              </Form.Field>
              <Form.Field required>
                <label>Last Name</label>
                <input
                  name="lastName"
                  placeholder="Last Name"
                  onChange={this.handleChange}
                />
              </Form.Field>
              <Form.Field required>
                <label>Email</label>
                <input
                  name="email"
                  placeholder="Email"
                  onChange={this.handleChange}
                />
              </Form.Field>
              <Form.Field required>
                <label>Password</label>
                <input
                  name="password"
                  placeholder="Password"
                  type="password"
                  onChange={this.handleChange}
                />
              </Form.Field>
              <Button type="submit" loading={loading}>
                Sign Up
              </Button>
            </Form>
          )}
        </Mutation>
      </Container>
    );
  }
}

export default SignUpPage;
