import Icon from 'components/common/Icon';

const setup = (props) => mount(<Icon { ...props }>link</Icon>);

describe('COMPONENTS - <Icon>', () => {
  test('render Icon', () => {
    const props = {
      type: 'menu',
      color: '#ff0000'
    };
    const component = setup(props);

    expect(component).toMatchSnapshot();
  });
});
