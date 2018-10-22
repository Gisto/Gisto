import { EditorSettings } from 'components/layout/content/settings/Editor';

const propSetup = (props = {}) => ({
  changeSettings: jest.fn(),
  ...props
});

const setup = (props) => mount(<EditorSettings { ...propSetup(props) }/>);

describe('COMPONENTS - <EditorSettings>', () => {
  test('render EditorSettings', () => {
    const component = setup();

    expect(component).toMatchSnapshot();
  });
});
