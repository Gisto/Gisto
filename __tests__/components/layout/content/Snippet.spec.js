import { Snippet } from 'components/layout/content/Snippet';

const propSetup = (props = {}) => ({
  ...props
});

const setup = (props) => mount(<Snippet { ...propSetup(props) }/>);

describe('COMPONENTS - <Snippet>', () => {
  test('render Snippet', () => {
    const component = setup({
      match: {
        params: {
          id: '123123'
        }
      },
      getSnippet: jest.fn()
    });

    expect(component).toMatchSnapshot();
  });
});
