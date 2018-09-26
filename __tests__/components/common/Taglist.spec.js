import { Taglist } from 'components/common/Taglist';

const setup = (props) => shallow(<Taglist { ...props }><div><span>#tag</span></div></Taglist>);

describe('COMPONENTS - <Taglist>', () => {
  test('render Taglist', () => {
    const props = {
      snippets: {}
    };
    const component = setup(props);

    expect(component).toMatchSnapshot();
  });
});
