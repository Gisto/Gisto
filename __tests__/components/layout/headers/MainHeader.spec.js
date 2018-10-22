import { MainHeader } from 'components/layout/headers/MainHeader';

const propSetup = (props = {}) => ({
  settings: {
    'settings-show-api-rate-limit': true
  },
  ...props
});

const setup = (props) => shallow(<MainHeader { ...propSetup(props) }/>);

describe('COMPONENTS - <MainHeader>', () => {
  test('render MainHeader', () => {
    const component = setup({
      loading: false,
      edit: false,
      rateLimit: {
        remaining: 5,
        limit: 10
      }
    });

    expect(component).toMatchSnapshot();
  });
});
