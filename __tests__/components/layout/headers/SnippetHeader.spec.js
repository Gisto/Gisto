import { SnippetHeader } from 'components/layout/headers/SnippetHeader';
import * as theme from 'constants/colors';

const propSetup = (props = {}) => ({
  ...props
});

const setup = (props) => shallow(<SnippetHeader { ...propSetup(props) }/>);

describe('COMPONENTS - <SnippetHeader>', () => {
  test('render SnippetHeader', () => {
    const component = setup({
      theme,
      match: {
        params: {
          id: '123123123123'
        }
      }
    });

    expect(component).toMatchSnapshot();
  });
});
