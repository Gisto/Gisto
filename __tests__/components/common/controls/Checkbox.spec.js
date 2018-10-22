import Checkbox from 'components/common/controls/Checkbox';

const propSetup = (props = {}) => ({
  className: 'classified',
  checked: true,
  onChange: jest.fn(),
  ...props
});

const setup = (props) => shallow(<Checkbox { ...propSetup(props) }>link</Checkbox>);

describe('COMPONENTS - <Checkbox>', () => {
  test('render Checkbox', () => {
    const component = setup();

    expect(component).toMatchSnapshot();
  });

  test('handle click', () => {
    const props = {
      onChange: jest.fn(),
      type: 'text'
    };
    const component = setup(propSetup(props));

    component.simulate('change');

    expect(props.onChange).toHaveBeenCalled();
  });
});
