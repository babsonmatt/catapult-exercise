import React from 'react';
import { Button, Container, Form, Header } from 'semantic-ui-react';

const UserPage = () => (
  <Container>
    <Form>
      <Header as="h1">Sign In</Header>
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

export default UserPage;
