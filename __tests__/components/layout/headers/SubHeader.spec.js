import { SubHeader } from 'components/layout/headers/SubHeader';

const propSetup = (props = {}) => ({
  ...props
});

const setup = (props) => shallow(<SubHeader { ...propSetup(props) }/>);

describe('COMPONENTS - <SubHeader>', () => {
  test('render SubHeader', () => {
    const component = setup();

    expect(component).toMatchSnapshot();
  });
});
