import Anchor from 'components/common/Anchor';

const setup = (props) => mount(<Anchor { ...props }>link</Anchor>);

describe('COMPONENTS - <Anchor>', () => {
  test('render Anchor', () => {
    const props = {
      download: 'file.zip',
      href: 'https://github.com'
    };
    const component = setup(props);

    expect(component).toMatchSnapshot();
  });

  test('handle click', () => {
    const props = {
      download: 'file.zip',
      href: 'https://github.com',
      onClick: jest.fn()
    };
    const component = setup(props);

    component.simulate('click');

    expect(props.onClick).toHaveBeenCalled();
  });
});
