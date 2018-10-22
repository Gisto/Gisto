import { SnippetsSettings } from 'components/layout/content/settings/Snippets';

const propSetup = (props = {}) => ({
  changeSettings: jest.fn(),
  ...props
});

const setup = (props) => shallow(<SnippetsSettings { ...propSetup(props) }/>);

describe('COMPONENTS - <SnippetsSettings>', () => {
  test('render SnippetsSettings', () => {
    const component = setup();

    expect(component).toMatchSnapshot();
  });
});
