import { DashBoard } from 'components/layout/content/DashBoard';
import * as theme from 'constants/colors';

const propSetup = (props = {}) => ({
  theme,
  ...props
});

const setup = (props) => shallow(<DashBoard { ...propSetup(props) }/>);

describe('COMPONENTS - <DashBoard>', () => {
  test('render DashBoard', () => {
    const component = setup({
      snippets: {},
      starred: 6,
      searchByLanguages: jest.fn(),
      getRateLimit: jest.fn(),
      snippetsLanguages: [],
      privateSnippets: 45
    });

    expect(component).toMatchSnapshot();
  });
});
