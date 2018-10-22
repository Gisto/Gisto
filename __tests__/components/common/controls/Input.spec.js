import Input from 'components/common/controls/Input';

const propSetup = (props = {}) => ({
  type: 'search',
  placeholder: 'I am temporary',
  className: 'classified',
  value: 'typetypetype',
  ...props
});

const setup = (props) => mount(<Input { ...propSetup(props) }>link</Input>);

describe('COMPONENTS - <Input>', () => {
  test('render Input', () => {
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
