import { NewSnippet } from 'components/layout/content/NewSnippet';

jest.mock('uuid', () => ({
  v4: () => '123123123123'
}));

const propSetup = (props) => ({
  ...props
});

const setup = (props) => shallow(<NewSnippet { ...propSetup(props) }/>);

describe('COMPONENTS - <NewSnippet>', () => {
  test('render NewSnippet', () => {
    const component = setup();

    expect(component).toMatchSnapshot();
  });
});
