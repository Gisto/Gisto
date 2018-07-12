import { About } from 'components/layout/content/About';

const propSetup = (props) => ({
  ...props
});

const setup = (props) => shallow(<About { ...propSetup(props) }/>);

describe('COMPONENTS - <About>', () => {
  test('render About', () => {
    const component = setup();

    expect(component).toMatchSnapshot();
  });
});
