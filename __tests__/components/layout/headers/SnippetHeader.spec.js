import { SnippetHeader } from 'components/layout/headers/SnippetHeader';

const propSetup = (props) => ({
  ...props
});

const setup = (props) => mount(<SnippetHeader { ...propSetup(props) }/>);

describe('COMPONENTS - <SnippetHeader>', () => {
  test('render SnippetHeader', () => {
    const component = setup({
      match: {
        params: {
          id: '123123123123'
        }
      }
    });

    expect(component).toMatchSnapshot();
  });
});
