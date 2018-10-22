import { Search } from 'components/Search';
import * as theme from 'constants/colors';

const propSetup = (props = {}) => ({
  theme,
  ...props
});

const setup = (props) => shallow(<Search { ...propSetup(props) }/>);

describe('COMPONENTS - <Search>', () => {
  test('render Search', () => {
    const component = setup({
      snippets: {},
      filterSnippets: jest.fn(),
      filterText: 'test',
      filterTags: [],
      filterLanguage: ''
    });

    expect(component).toMatchSnapshot();
  });
});
