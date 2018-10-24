import React from 'react';
import Enzyme, { mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import UserChart from '../components/UserChart';
import { ResponsiveLine } from '@nivo/line';

Enzyme.configure({ adapter: new Adapter() });

describe('UserChart', () => {
  it('renders without error', async () => {
    const component = mount(<UserChart data={[]} name={'Testy McTesterson'} />);
    expect(component.find(ResponsiveLine).exists()).toBe(true);
  });
});
