import React from 'react';
import Enzyme, { mount } from 'enzyme';
import wait from 'waait';
import Adapter from 'enzyme-adapter-react-16';
import { MockedProvider } from 'react-apollo/test-utils';
import { MemoryRouter, Route } from 'react-router-dom';
import { Form } from 'semantic-ui-react';
import SignUpPage, { SIGNUP_MUTATION } from './SignUp';

Enzyme.configure({ adapter: new Adapter() });

describe('SignUpPage', () => {
  it('renders without error', () => {
    const enzymeWrapper = mount(
      <MockedProvider mocks={[]} addTypename={false}>
        <MemoryRouter
          initialEntries={[{ pathname: '/signup' }]}
          initialIndex={1}
        >
          <Route exact path="/signup" component={SignUpPage} />
        </MemoryRouter>
      </MockedProvider>,
    );
    expect(enzymeWrapper.find('h1').text()).toBe('Sign Up');
  });

  it('should render loading state initially', async () => {
    const mocks = [
      {
        request: {
          query: SIGNUP_MUTATION,
          variables: {
            input: {
              firstName: 'firstname',
              lastName: 'lastname',
              email: 'test@test.com',
              password: 'password',
            },
          },
        },
        result: {
          data: {
            signup: {
              token: '123',
              currentUser: {
                id: '1',
                firstName: 'firstname',
                lastName: 'lastname',
                email: 'test@test.com',
                results: [],
                __typename: 'User'
              },
              __typename: 'Auth'
            },
          },
        },
      },
    ];

    const component = mount(
      <MockedProvider mocks={mocks} addTypename={true}>
        <MemoryRouter
          initialEntries={[{ pathname: '/signup' }]}
          initialIndex={1}
        >
          <Route exact path="/signup" component={SignUpPage} />
        </MemoryRouter>
      </MockedProvider>,
    );

    component
      .find('input')
      .at(0)
      .simulate('change', {
        target: { name: 'firstName', value: 'firstname' },
      });
    component
      .find('input')
      .at(1)
      .simulate('change', {
        target: { name: 'lastName', value: 'lastname' },
      });
    component
      .find('input')
      .at(2)
      .simulate('change', {
        target: { name: 'email', value: 'test@test.com' },
      });
    component
      .find('input')
      .at(3)
      .simulate('change', {
        target: { name: 'password', value: 'password' },
      });

    component.find('button').simulate('submit');
    await wait(0);
    expect(component.find(Form).length).toBe(1);
    expect(component.find(Form).prop('error')).toBe(false);
  });
});
