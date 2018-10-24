import React from 'react';
import Enzyme, { mount } from 'enzyme';
import wait from 'waait';
import Adapter from 'enzyme-adapter-react-16';
import { MockedProvider } from 'react-apollo/test-utils';
import ManagePage from './Manage';
import UserTable from '../components/UserTable';

Enzyme.configure({ adapter: new Adapter() });

describe('ManagePage', () => {
  it('renders without error', async () => {
    const component = mount(
      <MockedProvider mocks={[]} addTypename={false}>
        <ManagePage />
      </MockedProvider>,
    );
    expect(component.find('h1').text()).toBe('Manage Users');
    expect(component.find(UserTable).exists()).toBe(true);
  });

  it('onChange should update state.filter', async () => {
    const component = mount(
      <MockedProvider mocks={[]} addTypename={false}>
        <ManagePage />
      </MockedProvider>,
    );
    component
      .find('input')
      .props()
      .onChange({
        target: {
          value: 'test',
        },
      });
    await wait(500);
    expect(component.find(ManagePage).state('filter')).toEqual('test');
  });
});
