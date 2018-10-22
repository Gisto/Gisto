import Updater from 'components/layout/Updater';

const propSetup = (props = {}) => ({
  ...props
});

const setup = (props) => shallow(<Updater { ...propSetup(props) }/>);

describe('COMPONENTS - <Updater>', () => {
  test('render Updater', () => {
    const component = setup();

    expect(component).toMatchSnapshot();
  });
});
