import React from 'react';
import { Button, Container, Form, Header } from 'semantic-ui-react';

const ManagePage = () => (
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
      <Header as="h1">Manage Users</Header>
      <Form.Field>
        <label>Email</label>
        <input placeholder="Email" />
      </Form.Field>
      <Form.Field>
        <label>Password</label>
        <input placeholder="Password" />
      </Form.Field>
      <Button type="submit">Sign In</Button>
    </Form>
  </Container>
);

export default ManagePage;
