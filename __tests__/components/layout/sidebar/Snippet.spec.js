import { Snippet } from 'components/layout/sidebar/Snippet';
import PropTypes from 'prop-types';

const propSetup = (props) => ({
  ...props
});

const setup = (props) => shallow(<Snippet { ...propSetup(props) }/>);

describe('COMPONENTS - <Snippet>', () => {
  test('render Snippet', () => {
    const component = setup({
      snippet: {
        id: '123123123123',
        star: true
      },
      setStar: jest.fn(),
      unsetStar: jest.fn()
    });

    expect(component).toMatchSnapshot();
  });
});
