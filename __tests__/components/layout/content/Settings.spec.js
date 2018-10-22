import Settings from 'components/layout/content/Settings';

const propSetup = (props = {}) => ({
  ...props
});

const setup = (props) => shallow(<Settings { ...propSetup(props) }/>);

describe('COMPONENTS - <Settings>', () => {
  test('render Settings', () => {
    const component = setup();

    expect(component).toMatchSnapshot();
  });
});
