import { App } from 'components/layout/App';

const propSetup = (props) => ({
  ...props
});

const setup = (props) => shallow(<App { ...propSetup(props) }/>);

describe('COMPONENTS - <App>', () => {
  test('render App', () => {
    const component = setup();

    expect(component).toMatchSnapshot();
  });
});
