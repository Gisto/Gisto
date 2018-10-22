import { SnippetsList } from 'components/layout/sidebar/SnippetsList';

const propSetup = (props = {}) => ({
  ...props
});

const setup = (props) => shallow(<SnippetsList { ...propSetup(props) }/>);

describe('COMPONENTS - <SnippetsList>', () => {
  test('render SnippetsList', () => {
    const component = setup();

    expect(component).toMatchSnapshot();
  });
});
