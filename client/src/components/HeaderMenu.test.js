import React from 'react';
import Enzyme, { mount } from 'enzyme';
import wait from 'waait';
import Adapter from 'enzyme-adapter-react-16';
import { MemoryRouter, Route } from 'react-router-dom';
import { MockedProvider } from 'react-apollo/test-utils';
import { Menu } from 'semantic-ui-react';
import HeaderMenu, { CURRENT_USER_QUERY } from '../components/HeaderMenu';

Enzyme.configure({ adapter: new Adapter() });

describe('HeaderMenu', () => {
  it('renders without error', async () => {
    debugger;
    const component = mount(
      <MockedProvider mocks={[]} addTypename={false}>
        <MemoryRouter
          initialEntries={[{ pathname: '/signin' }]}
          initialIndex={1}
        >
          <HeaderMenu />
        </MemoryRouter>
      </MockedProvider>,
    );
    expect(component.find(Menu.Item).length).toBe(3);
  });

  it('renders the correct menu items while logged out', async () => {
    const component = mount(
      <MockedProvider mocks={[]} addTypename={false}>
        <MemoryRouter
          initialEntries={[{ pathname: '/signin' }]}
          initialIndex={1}
        >
          <HeaderMenu />
        </MemoryRouter>
      </MockedProvider>,
    );
    expect(component.find(Menu.Item).length).toBe(3);
    expect(
      component
        .find(Menu.Item)
        .at(0)
        .text(),
    ).toBe('Sign Up');
    expect(
      component
        .find(Menu.Item)
        .at(2)
        .text(),
    ).toBe('Sign In');
  });

  it('renders the correct menu items while logged in', async () => {
    localStorage.setItem('authToken', 'test');
    const mocks = [
      {
        request: {
          query: CURRENT_USER_QUERY,
        },
        result: {
          data: {
            currentUser: {
              id: '1',
              firstName: 'firstname',
              lastName: 'lastname',
              email: 'test@test.com',
              results: [],
              __typename: 'User',
            },
          },
        },
      },
    ];
    const component = mount(
      <MockedProvider mocks={mocks} addTypename={true}>
        <MemoryRouter initialEntries={[{ pathname: '/home' }]} initialIndex={1}>
          <HeaderMenu />
        </MemoryRouter>
      </MockedProvider>,
    );
    await wait(0);
    component.update();
    expect(component.find('div.item').length).toBe(4);
    expect(
      component
        .find(Menu.Item)
        .at(0)
        .text(),
    ).toBe('Home');
    expect(
      component
        .find(Menu.Item)
        .at(2)
        .text(),
    ).toBe('Hi, firstname!');
    expect(
      component
        .find(Menu.Item)
        .at(3)
        .text(),
    ).toBe('Sign Out');
  });
});
