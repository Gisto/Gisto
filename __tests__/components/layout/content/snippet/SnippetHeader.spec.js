import { SnippetHeader } from 'components/layout/content/snippet/SnippetHeader';
import * as theme from 'constants/colors';

const propSetup = (props = {}) => ({
  theme,
  file: {
    filename: 'somefile.js'
  },
  username: 'user',
  snippetId: '123123123123',
  edit: false,
  tempSnippet: {},
  updateTempSnippet: jest.fn(),
  deleteFile: jest.fn(),
  ...props
});

const setup = (props) => shallow(<SnippetHeader { ...propSetup(props) }/>);

describe('COMPONENTS - <SnippetHeader>', () => {
  test('render SnippetHeader in view mode', () => {
    const component = setup({
      edit: false
    });

    expect(component).toMatchSnapshot();
  });

  test('render SnippetHeader in edit mode', () => {
    const component = setup({
      edit: true,
    });

    expect(component).toMatchSnapshot();
  });
});
