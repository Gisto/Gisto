import Anchor from 'components/common/Anchor';

test('render Anchor', () => {
  const wrapper = shallow(<Anchor download="file.zip" href="https://github.com"/>);

  expect(wrapper).toMatchSnapshot();
});
