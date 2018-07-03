import { LogIn } from 'components/LogIn';

const spy = sinon.spy();

const propSetup = (props) => ({
  loginBasic: jest.fn(),
  loginWithToken: jest.fn(),
  twoFactorAuth: '',
  loading: false,
  ...props
});

const setup = (props) => mount(<LogIn { ...propSetup(props) }/>);

describe('COMPONENTS - <LogIn>', () => {
  test('render LogIn basic', () => {
    const component = setup({
      loginBasic: spy
    });

    component.find('Button').simulate('click');
    expect(component.instance().loginBasic).toBeCalled;
    expect(component).toMatchSnapshot();
  });

  test('render LogIn token', () => {
    const component = setup({
      loginWithToken: spy
    });

    component.setState({
      loginType: {
        token: true
      }
    });

    expect(component).toMatchSnapshot();
    component.find('Button').simulate('click');
    expect(component.instance().loginWithToken).toBeCalled;
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
