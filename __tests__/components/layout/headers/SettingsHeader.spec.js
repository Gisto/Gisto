import SettingsHeader from 'components/layout/headers/SettingsHeader';

const propSetup = (props) => ({
  ...props
});

const setup = (props) => mount(<SettingsHeader { ...propSetup(props) }/>);

describe('COMPONENTS - <SettingsHeader>', () => {
  test('render SettingsHeader', () => {
    const component = setup();

    expect(component).toMatchSnapshot();
  });
});
