import { SuperSearch } from 'components/layout/SuperSearch';
import * as theme from 'constants/colors';

const propSetup = (props = {}) => ({
  theme,
  ...props
});

const setup = (props) => mount(<SuperSearch { ...propSetup(props) }/>);

describe('COMPONENTS - <SuperSearch>', () => {
  test('render SuperSearch', () => {
    const component = setup({
      snippets: {},
      filterSnippets: jest.fn(),
      filterText: 'test',
      filterTags: [],
      filterLanguage: '',
      toggleSuperSesrch: jest.fn()
    });

    expect(component).toMatchSnapshot();
  });
});
