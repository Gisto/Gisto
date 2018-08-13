import { UtilityIcon } from 'components/common/UtilityIcon';

const propSetup = (props) => ({
  ...props
});

const setup = (props) => mount(<UtilityIcon { ...propSetup(props) }/>);

describe('COMPONENTS - <UtilityIcon>', () => {
  test('render UtilityIcon', () => {
    const component = setup({
      children: [<div>1</div>, <div>1</div>, <div>1</div>],
      size: 20,
      type: 'menu',
      color: 'red',
      onClick: jest.fn(),
      dropdown: true,
      title: 'UtilityIcon',
      className: 'UtilityIcon'
    });

    expect(component).toMatchSnapshot();
  });
});
