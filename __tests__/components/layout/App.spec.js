import { App } from 'components/layout/App';
import * as theme from 'constants/colors';

const propSetup = (props = {}) => ({
  theme,
  ...props
});

const setup = (props) => shallow(<App { ...propSetup(props) }/>);

describe('COMPONENTS - <App>', () => {
  test('render App', () => {
    const component = setup();

    expect(component).toMatchSnapshot();
  });
});
