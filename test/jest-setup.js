import React from 'react';
import Enzyme, {
  shallow, render, mount 
} from 'enzyme';
import { noop } from 'lodash/fp';
import Adapter from 'enzyme-adapter-react-16';

// React 16 Enzyme adapter
Enzyme.configure({ adapter: new Adapter() });
// Make Enzyme functions available in all test files without importing
global.shallow = shallow;
global.render = render;
global.mount = mount;
global.React = React;
global.gtag = noop;
