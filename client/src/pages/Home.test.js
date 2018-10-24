import React from 'react';
import Enzyme, { mount } from 'enzyme';
import wait from 'waait';
import Adapter from 'enzyme-adapter-react-16';
import { MockedProvider } from 'react-apollo/test-utils';
import UserChart from '../components/UserChart';
import HomePage, { CURRENT_USER_QUERY } from './Home';

Enzyme.configure({ adapter: new Adapter() });

describe('HomePage', () => {
  it('renders without error', () => {
    mount(
      <MockedProvider mocks={[]} addTypename={false}>
        <HomePage />
      </MockedProvider>,
    );
  });

  it.only('displays the correct welcome message and chart', async () => {
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
              results: [
                { timestamp: 1535774400, result: 20 },
                { timestamp: 1535860800, result: 34 },
              ],
              __typename: 'User',
            },
          },
        },
      },
    ];

    const component = mount(
      <MockedProvider mocks={mocks} addTypename={true}>
        <HomePage />
      </MockedProvider>,
    );

    expect(component.find('p').text()).toBe('Loading...');
    await wait(0);
    expect(component.find(UserChart).exists()).toBe(true);
    expect(component.find('h1').text()).toBe('test');
  });
});
