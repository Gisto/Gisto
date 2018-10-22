import { About } from 'components/layout/content/About';

jest.mock('../../../../build/icon.png', () => 'icon.png');
jest.mock('../../../../package.json', () => ({
  version: 'X.X.X'
}));

const propSetup = (props = {}) => ({
  ...props
});

const setup = (props) => mount(<About { ...propSetup(props) }/>);

describe('COMPONENTS - <About>', () => {
  test('render About', () => {
    const component = setup();

    expect(component).toMatchSnapshot();
  });
});
