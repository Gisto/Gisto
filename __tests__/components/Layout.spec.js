import Layout from 'components/Layout';
import '__mocks__/localStorage';

const propSetup = (props) => ({
  ...props
});

const setup = (props) => shallow(<Layout { ...propSetup(props) }/>);

describe('COMPONENTS - <Layout>', () => {
  test('render Layout', () => {
    const component = setup();

    expect(component).toMatchSnapshot();
  });
});
