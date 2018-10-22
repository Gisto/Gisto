import { Layout } from 'components/Layout';
import * as theme from 'constants/colors';

const propSetup = (props = {}) => ({
  theme,
  ...props
});

const setup = (props) => shallow(<Layout { ...propSetup(props) }/>);

describe('COMPONENTS - <Layout>', () => {
  test('render Layout when logged in', () => {
    const component = setup();

    expect(component).toMatchSnapshot();
  });

  test('render Layout when not logged in', () => {
    const isLoggedIn = false;
    const component = setup();

    expect(component).toMatchSnapshot();
  });
});
