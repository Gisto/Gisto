import { DashBoard } from 'components/layout/content/DashBoard';
import { headerBgLightest } from '../../../../src/constants/colors';

jest.mock('constants/colors', () => ({
  headerBgLightest: 'red',
  baseAppColor: 'red'
}));

const propSetup = (props) => ({
  ...props
});

const setup = (props) => mount(<DashBoard { ...propSetup(props) }/>);

describe('COMPONENTS - <DashBoard>', () => {
  test('render DashBoard', () => {
    const component = setup({
      snippets: {},
      starred: 6,
      searchByTags: jest.fn(),
      searchByLanguages: jest.fn(),
      getRateLimit: jest.fn(),
      snippetsLanguages: [],
      privateSnippets: 45
    });

    expect(component).toMatchSnapshot();
  });
});
