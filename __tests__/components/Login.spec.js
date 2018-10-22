import { LogIn } from 'components/LogIn';
import * as theme from 'constants/colors';

jest.mock('../../package.json', () => ({ version: 'X.X.X' }));

const propSetup = (props = {}) => ({
  loginBasic: jest.fn(),
  loginWithToken: jest.fn(),
  twoFactorAuth: false,
  loading: false,
  theme,
  ...props
});

const setup = (props) => mount(<LogIn { ...propSetup(props) }/>);

describe.skip('COMPONENTS - <LogIn>', () => {
  let spy;

  beforeEach(() => {
    spy = jest.fn();
  });

  test('render LogIn basic', () => {
    const component = setup({
      loginBasic: spy
    });

    component.find('Input[type="text"]').simulate('change');
    expect(component.instance().setField).toBeCalled;

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

    component.find('Input[type="text"]').at(0).simulate('change', { target: { value: '123-123-123-123' } })
    expect(component.instance().setField).toBeCalled;

    expect(component).toMatchSnapshot();
    component.find('Button').simulate('click');
    expect(component.instance().loginWithToken).toBeCalled;
  });

  test('render LogIn enterprise', () => {
    const component = setup({ theme });

    component.setState({
      loginType: {
        enterprise: true
      }
    });

    component.find('Input[type="text"]').at(0).simulate('change', { target: { value: 'abc' } })
    expect(component.instance().setField).toBeCalled;

    expect(component).toMatchSnapshot();
  });

  test('render LogIn github oauth2', () => {
    const component = setup();

    component.setState({
      loginType: {
        github: true
      }
    });

    component.find('Button').simulate('click');
    expect(component.instance().loginWithOauth2).toBeCalled;

    expect(component).toMatchSnapshot();
  });
});
