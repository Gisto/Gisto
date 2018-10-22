import TextArea from 'components/common/controls/TextArea';

const propSetup = (props = {}) => ({
  type: 'search',
  placeholder: 'I am temporary',
  className: 'classified',
  value: 'typetypetype',
  ...props
});

const setup = (props) => mount(<TextArea { ...propSetup(props) }>link</TextArea>);

describe('COMPONENTS - <TextArea>', () => {
  test('render TextArea', () => {
    const component = setup();

    expect(component).toMatchSnapshot();
  });

  test('handle click', () => {
    const props = {
      onChange: jest.fn(),
      type: 'textarea'
    };
    const component = setup(propSetup(props));

    component.simulate('change');

    expect(props.onChange).toHaveBeenCalled();
  });
});
