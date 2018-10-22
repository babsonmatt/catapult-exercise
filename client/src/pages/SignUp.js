import React from 'react';
import { Button, Container, Form, Header } from 'semantic-ui-react';

const SignUpPage = () => (
  <Container
    style={{
      height: '100vh',
      display: 'flex',
    }}
  >
    <Form
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Header as="h1">Sign Up</Header>
      <Form.Field>
        <label>First Name</label>
        <input placeholder="First Name" />
      </Form.Field>
      <Form.Field>
        <label>Last Name</label>
        <input placeholder="Last Name" />
      </Form.Field>
      <Form.Field>
        <label>Email</label>
        <input placeholder="Email" />
      </Form.Field>
      <Form.Field>
        <label>Password</label>
        <input placeholder="Password" />
      </Form.Field>
      <Button type="submit">Sign Up</Button>
    </Form>
  </Container>
);

export default SignUpPage;
