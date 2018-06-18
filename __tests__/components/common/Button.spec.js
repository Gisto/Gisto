import Button from 'components/common/Button';

const propSetup = (props) => ({
  icon: 'menu',
  children: <div/>,
  width: '200px',
  height: '30px',
  invert: true,
  className: 'btn',
  ...props
});

const setup = (props) => (shallow(<Button { ...props }>link</Button>));

describe('COMPONENTS - <Button>', () => {
  test('render Button', () => {
    const wrapper = setup(propSetup());

    expect(wrapper).toMatchSnapshot();
  });

  test('handle click', () => {
    const props = {
      onClick: jest.fn(),
      invert: false
    };
    const wrapper = setup(propSetup(props));

    wrapper.simulate('click');

    expect(props.onClick).toHaveBeenCalled();
  });
});
