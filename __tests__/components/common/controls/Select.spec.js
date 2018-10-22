import Select from 'components/common/controls/Select';

const propSetup = (props = {}) => ({
  className: 'classified',
  value: 'bla-bla',
  onChange: jest.fn(),
  children: [
    <option key={'1'}>1</option>,
    <option key={'2'}>2</option>,
    <option key={'bla-bla'}>bla-bla</option>
  ],
  ...props
});

const setup = (props) => shallow(<Select { ...propSetup(props) }>{ props.children }</Select>);

describe('COMPONENTS - <Select>', () => {
  test('render Select', () => {
    const component = setup({
      children: [
        <option key={'1'}>1</option>,
        <option key={'2'}>2</option>,
        <option key={'bla-bla'}>bla-bla</option>
      ],
    });

    expect(component).toMatchSnapshot();
  });

  test('handle change', () => {
    const props = {
      onChange: jest.fn(),children: [
        <option key={'1'}>1</option>,
        <option key={'2'}>2</option>,
        <option key={'bla-bla'}>bla-bla</option>
      ]
    };
    const component = setup(propSetup(props));

    component.simulate('change');

    expect(props.onChange).toHaveBeenCalled();
  });
});
