import { NewSnippet } from 'components/layout/content/NewSnippet';
import * as theme from 'constants/colors';

jest.mock('uuid', () => ({
  v4: () => '123123123123'
}));

jest.mock('utils/string', () => ({
  randomString: () => 'abcdabcd'
}));

const propSetup = (props = {}) => ({
  theme,
  ...props
});

const setup = (props) => shallow(<NewSnippet { ...propSetup(props) }/>);

describe('COMPONENTS - <NewSnippet>', () => {
  test('render NewSnippet', () => {
    const component = setup();

    expect(component).toMatchSnapshot();
  });
});
