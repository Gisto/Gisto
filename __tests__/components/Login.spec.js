import { LogIn } from 'components/LogIn';

const propSetup = (props) => ({
  loginBasic: jest.fn(),
  loginWithToken: jest.fn(),
  twoFactorAuth: '',
  loading: false,
  ...props
});

const setup = (props) => shallow(<LogIn { ...propSetup(props) }/>);

describe('COMPONENTS - <LogIn>', () => {
  test('render LogIn basic', () => {
    const component = setup();

    expect(component).toMatchSnapshot();
  });

  test('render LogIn token', () => {
    const component = setup();

    component.setState({
      loginType: {
        token: true
      } 
    });
    expect(component).toMatchSnapshot();
  });

  test('render LogIn enterprise', () => {
    const component = setup();

    component.setState({
      loginType: {
        enterprise: true
      }
    });
    expect(component).toMatchSnapshot();
  });

  test('render LogIn github oauth2', () => {
    const component = setup();

    component.setState({
      loginType: {
        github: true
      }
    });
    expect(component).toMatchSnapshot();
  });
});
