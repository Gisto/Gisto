import Anchor from 'components/common/Anchor';

const setup = (props) => (shallow(<Anchor { ...props }>link</Anchor>));

describe('COMPONENTS - <Anchor>', () => {
  test('render Anchor', () => {
    const props = {
      download: 'file.zip',
      href: 'https://github.com'
    };
    const wrapper = setup(props);

    expect(wrapper).toMatchSnapshot();
  });

  test('handle click', () => {
    const props = {
      download: 'file.zip',
      href: 'https://github.com',
      onClick: jest.fn()
    };
    const wrapper = setup(props);

    wrapper.simulate('click');

    expect(props.onClick).toHaveBeenCalled();
  });
});
