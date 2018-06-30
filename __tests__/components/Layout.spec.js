import Layout from 'components/Layout';
import '__mocks__/localStorage';

const propSetup = (props) => ({
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
