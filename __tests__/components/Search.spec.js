import { Search } from 'components/Search';

const propSetup = (props) => ({
  ...props
});

const setup = (props) => mount(<Search { ...propSetup(props) }/>);

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
