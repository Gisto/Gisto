import { Sidebar } from 'components/layout/sidebar/Sidebar';

const propSetup = (props = {}) => ({
  ...props
});

const setup = (props) => shallow(<Sidebar { ...propSetup(props) }/>);

describe('COMPONENTS - <Sidebar>', () => {
  test('render Sidebar', () => {
    const component = setup();

    expect(component).toMatchSnapshot();
  });
});
