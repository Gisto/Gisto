import { LogIn } from 'components/LogIn';

const propSetup = (props) => ({
  ...props
});

const setup = (props) => shallow(<LogIn { ...propSetup(props) }/>);

describe('COMPONENTS - <LogIn>', () => {
  test('render LogIn', () => {
    const component = setup({
      loginBasic: jest.fn(),
      loginWithToken: jest.fn(),
      twoFactorAuth: '',
      loading: false
    });

    expect(component).toMatchSnapshot();
  });
});
