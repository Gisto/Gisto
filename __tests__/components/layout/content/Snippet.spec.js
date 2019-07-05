import { Snippet } from 'components/layout/content/Snippet';

jest.mock('lodash/fp', () => ({
  debounce: (fn) => fn,
  get: (fn) => fn,
  filter: (fn) => fn
}));

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
