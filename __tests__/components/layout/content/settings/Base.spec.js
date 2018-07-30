import BaseSettings from 'components/layout/content/settings/Base';

const propSetup = (props) => ({
  ...props
});

const setup = (props) => mount(<BaseSettings { ...propSetup(props) }/>);

describe('COMPONENTS - <BaseSettings>', () => {
  test('render BaseSettings', () => {
    const component = setup();

    expect(component).toMatchSnapshot();
  });
});
