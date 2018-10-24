import React from 'react';
import Enzyme, { mount } from 'enzyme';
import wait from 'waait';
import Adapter from 'enzyme-adapter-react-16';
import { MockedProvider } from 'react-apollo/test-utils';
import { Button, Table } from 'semantic-ui-react';
import UserTable, { GET_USERS_QUERY } from './UserTable';
import { DELETE_USER_MUTATION } from './DeleteUserButton';

Enzyme.configure({ adapter: new Adapter() });

describe('UserTable', () => {
  it('renders a table with a row per user', async () => {
    const mocks = [
      {
        request: {
          query: GET_USERS_QUERY,
          variables: {
            filter: '',
          },
        },
        result: {
          data: {
            users: [
              {
                id: '1',
                firstName: 'firstname',
                lastName: 'lastname',
                email: 'test@test.com',
                results: [],
                __typename: 'User',
              },
              {
                id: '2',
                firstName: 'firstname2',
                lastName: 'lastname2',
                email: 'test2@test.com',
                results: [],
                __typename: 'User',
              },
            ],
          },
        },
      },
    ];
    const component = mount(
      <MockedProvider mocks={mocks} addTypename={true}>
        <UserTable filter={''} />
      </MockedProvider>,
    );
    expect(component.find('p').text()).toBe('Loading...');
    await wait(0);
    component.update();
    expect(component.find(Table).length).toBe(1);
    expect(component.find(Table.Row).length).toBe(3);
    expect(component.find(Button).length).toBe(4);
  });

  it('renders a modal with a chart when the chart button is clicked', async () => {
    const mocks = [
      {
        request: {
          query: GET_USERS_QUERY,
          variables: {
            filter: '',
          },
        },
        result: {
          data: {
            users: [
              {
                id: '1',
                firstName: 'firstname',
                lastName: 'lastname',
                email: 'test@test.com',
                results: [],
                __typename: 'User',
              },
            ],
          },
        },
      },
    ];
    const component = mount(
      <MockedProvider mocks={mocks} addTypename={true}>
        <UserTable filter={''} />
      </MockedProvider>,
    );
    expect(component.find('p').text()).toBe('Loading...');
    await wait(0);
    component.update();
    expect(component.find(Button).length).toBe(2);
    component
      .find(Button)
      .at(0)
      .simulate('click');
    expect(component.find('div.ui.modal.visible.active').length).toBe(1);
    expect(component.find('div.ui.modal.visible.active .header').text()).toBe(
      "firstname lastname's Chart",
    );
  });

  it('renders a confirmation modal when the delete button is clicked + deletes a row when yes is clicked', async () => {
    const mocks = [
      {
        request: {
          query: GET_USERS_QUERY,
          variables: {
            filter: '',
          },
        },
        result: {
          data: {
            users: [
              {
                id: '1',
                firstName: 'firstname',
                lastName: 'lastname',
                email: 'test@test.com',
                results: [],
                __typename: 'User',
              },
            ],
          },
        },
      },
      {
        request: {
          query: DELETE_USER_MUTATION,
          variables: {
            id: '1',
          },
        },
        result: {
          data: {
            deleteUser: {
              id: '1',
              __typename: 'User',
            },
          },
        },
      },
    ];
    const component = mount(
      <MockedProvider mocks={mocks} addTypename={true}>
        <UserTable filter={''} />
      </MockedProvider>,
    );
    expect(component.find('p').text()).toBe('Loading...');
    await wait(0);
    component.update();
    expect(component.find(Button).length).toBe(2);

    // click the delete button
    component
      .find(Button)
      .at(1)
      .simulate('click');
    expect(component.find('div.ui.mini.modal.visible.active').length).toBe(1);
    expect(
      component.find('div.ui.mini.modal.visible.active .header').text(),
    ).toBe('Delete firstname lastname?');

    // click the Yes button to delete the user
    component
      .find('div.ui.mini.modal.visible.active .actions button')
      .at(1)
      .simulate('click');

    // verify the row has been removed from the user table (1 including header row)
    await wait(0);
    component.update();
    expect(component.find(Table.Row).length).toBe(1);
  });
});
