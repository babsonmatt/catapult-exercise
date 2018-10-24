import React from 'react';
import Enzyme, { mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { MockedProvider } from 'react-apollo/test-utils';
import { Button, Modal } from 'semantic-ui-react';
import DeleteUserButton from './DeleteUserButton';

Enzyme.configure({ adapter: new Adapter() });

describe('UserTable', () => {
  it('renders a button', async () => {
    const user = {
      id: '1',
      firstName: 'firstname',
      lastName: 'lastname',
      email: 'test@test.com',
      results: [],
    };

    const component = mount(
      <MockedProvider mocks={[]} addTypename={true}>
        <DeleteUserButton user={user} filter={''} />
      </MockedProvider>,
    );
    expect(component.find(Button).length).toBe(1);
    expect(component.find(Modal).length).toBe(1);
  });
});
