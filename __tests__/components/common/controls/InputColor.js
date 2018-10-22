import InputColor from 'components/common/controls/InputColor';

const propSetup = (props = {}) => ({
  color: 'red',
  onChange: jest.fn(),
  ...props
});

const setup = (props) => shallow(<InputColor { ...props }/>);

describe('COMPONENTS - <InputColor>', () => {
  test('render InputColor', () => {
    const component = setup(propSetup());

    expect(component).toMatchSnapshot();
  });

  test('handle change', () => {
    const props = {
      onChange: jest.fn()
    };
    const component = setup(propSetup(props));

    component.simulate('change', { target: { value: 'blue' } });

    expect(props.onChange).toHaveBeenCalled();
  });
});
