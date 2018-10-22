import { Main } from 'components/layout/Main';

const propSetup = (props = {}) => ({
  ...props
});

const setup = (props) => shallow(<Main { ...propSetup(props) }/>);

describe('COMPONENTS - <Main>', () => {
  test('render Main', () => {
    const component = setup({
      edit: true,
      getSnippets: jest.fn(),
      getStarredSnippets: jest.fn(),
      getEmoji: jest.fn(),
    });

    expect(component).toMatchSnapshot();
  });
});
