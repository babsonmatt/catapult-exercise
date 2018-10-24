import React from 'react';
import Enzyme, { mount } from 'enzyme';
import wait from 'waait';
import Adapter from 'enzyme-adapter-react-16';
import { MockedProvider } from 'react-apollo/test-utils';
import { MemoryRouter, Route } from 'react-router-dom';
import { Form } from 'semantic-ui-react';
import SignInPage, { SIGNIN_MUTATION } from './signin';

Enzyme.configure({ adapter: new Adapter() });

describe('SignInPage', () => {
  it('renders without error', () => {
    const enzymeWrapper = mount(
      <MockedProvider mocks={[]} addTypename={false}>
        <MemoryRouter
          initialEntries={[{ pathname: '/signin' }]}
          initialIndex={1}
        >
          <Route exact path="/signin" component={SignInPage} />
        </MemoryRouter>
      </MockedProvider>,
    );
    expect(enzymeWrapper.find('h1').text()).toBe('Sign In');
  });

  it('submits the form without any errors', async () => {
    const mocks = [
      {
        request: {
          query: SIGNIN_MUTATION,
          variables: {
            input: {
              email: 'test@test.com',
              password: 'password',
            },
          },
        },
        result: {
          data: {
            signin: {
              token: '123',
              currentUser: {
                id: '1',
                firstName: 'firstname',
                lastName: 'lastname',
                email: 'test@test.com',
                results: [],
                __typename: 'User',
              },
              __typename: 'Auth',
            },
          },
        },
      },
    ];

    const component = mount(
      <MockedProvider mocks={mocks} addTypename={true}>
        <MemoryRouter
          initialEntries={[{ pathname: '/signin' }]}
          initialIndex={1}
        >
          <Route exact path="/signin" component={SignInPage} />
        </MemoryRouter>
      </MockedProvider>,
    );

    component
      .find('input')
      .at(0)
      .simulate('change', {
        target: { name: 'email', value: 'test@test.com' },
      });
    component
      .find('input')
      .at(1)
      .simulate('change', {
        target: { name: 'password', value: 'password' },
      });

    component.find('button').simulate('submit');
    await wait(0);
    expect(component.find(Form).length).toBe(1);
    expect(component.find(Form).prop('error')).toBe(false);
  });

  it('sets error state if there is an unknown error', async () => {
    const mocks = [
      {
        request: {
          query: SIGNIN_MUTATION,
          variables: {
            input: {
              email: '',
              password: '',
            },
          },
        },
        error: new Error('Woops!'),
      },
    ];

    const component = mount(
      <MockedProvider mocks={mocks} addTypename={true}>
        <MemoryRouter
          initialEntries={[{ pathname: '/signin' }]}
          initialIndex={1}
        >
          <Route exact path="/signin" component={SignInPage} />
        </MemoryRouter>
      </MockedProvider>,
    );

    component.find('button').simulate('submit');
    await wait(10);
    expect(component.find(SignInPage).state('error')).not.toBe('');
  });

  it('sets error state if there is an error', async () => {
    const mocks = [
      {
        request: {
          query: SIGNIN_MUTATION,
          variables: {
            email: 'test@test.com',
            password: 'password',
          },
        },
        result: {
          errors: [
            {
              extensions: {
                code: 'BAD_USER_INPUT',
                exception: {
                  validationErrors: {
                    password: 'Invalid Email and/or Password',
                  },
                },
              },
              message: 'Bad stuff!',
              path: ['signin'],
            },
          ],
          data: {
            login: null,
          },
        },
      },
    ];

    const component = mount(
      <MockedProvider mocks={mocks} addTypename={true}>
        <MemoryRouter
          initialEntries={[{ pathname: '/signin' }]}
          initialIndex={1}
        >
          <Route exact path="/signin" component={SignInPage} />
        </MemoryRouter>
      </MockedProvider>,
    );

    component
      .find('input')
      .at(0)
      .simulate('change', {
        target: { name: 'email', value: 'test@test.com' },
      });
    component
      .find('input')
      .at(1)
      .simulate('change', {
        target: { name: 'password', value: 'password' },
      });

    component.find('button').simulate('submit');
    await wait(10);
    expect(component.find(SignInPage).state('error')).toBe(
      'Invalid Email and/or Password',
    );
  });
});
