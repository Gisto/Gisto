import Loading from 'components/common/Loading';
import { baseAppColor } from 'constants/colors';

const setup = (props) => shallow(<Loading { ...props }/>);

describe('COMPONENTS - <Loading>', () => {
  test('render Loading', () => {
    const component = setup({ color: baseAppColor });

    expect(component).toMatchSnapshot();
  });
});
