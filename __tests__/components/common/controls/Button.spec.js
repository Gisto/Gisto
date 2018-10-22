import { Button } from 'components/common/controls/Button';
import * as theme from 'constants/colors';

const propSetup = (props = {}) => ({
  icon: 'menu',
  children: <div/>,
  width: '200px',
  height: '30px',
  invert: true,
  className: 'btn',
  onClick: jest.fn(),
  theme,
  disabled: false,
  ...props
});

const setup = (props) => mount(<Button { ...props }>link</Button>);

describe('COMPONENTS - <Button>', () => {
  test('render Button', () => {
    const component = setup(propSetup());

    expect(component).toMatchSnapshot();
  });

  test('handle click', () => {
    const props = {
      onClick: jest.fn(),
      invert: false
    };
    const component = setup(propSetup(props));

    component.simulate('click');

    expect(props.onClick).toHaveBeenCalled();
  });
});
