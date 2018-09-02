import KeyBindings from 'components/layout/KeyBindings';

const setup = () => shallow(<KeyBindings/>);

describe('COMPONENTS - <KeyBindings>', () => {
  test('render KeyBindings', () => {
    const component = setup();

    expect(component).toMatchSnapshot();
  });
});
