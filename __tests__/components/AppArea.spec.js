import { AppArea } from 'components/AppArea';

const propSetup = (props) => ({
  ...props
});

const setup = (props) => shallow(<AppArea { ...propSetup(props) }/>);

describe('COMPONENTS - <AppArea>', () => {
  test('render AppArea', () => {
    const component = setup({
      user: {
        login: 'user',
        avatarUrl: 'url://avatar'
      },
      getUser: jest.fn(),
      logout: jest.fn()
    });

    expect(component).toMatchSnapshot();
  });
});
