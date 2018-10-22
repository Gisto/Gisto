import { Content } from 'components/layout/Content';

const propSetup = (props = {}) => ({
  ...props
});

const setup = (props) => shallow(<Content { ...propSetup(props) }/>);

describe('COMPONENTS - <Content>', () => {
  test('render Content', () => {
    const component = setup();

    expect(component).toMatchSnapshot();
  });
});
