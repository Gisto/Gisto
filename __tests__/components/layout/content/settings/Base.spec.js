import BaseSettings from 'components/layout/content/settings/Base';

const propSetup = (props) => ({
  ...props
});

const setup = (props) => shallow(<BaseSettings { ...propSetup(props) }/>);

describe('COMPONENTS - <BaseSettings>', () => {
  test('render BaseSettings', () => {
    const component = setup();

    expect(component).toMatchSnapshot();
  });

  test('change color', () => {
    const component = setup();

    expect(component.find('input')).toHaveLength(1);
    component.find('input').simulate('change', { target: { value: '#ff0000' } });
  });
});
