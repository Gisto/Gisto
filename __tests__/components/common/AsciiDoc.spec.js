import Asciidoc from 'components/common/editor/Asciidoc';

const setup = (props) => shallow(<Asciidoc { ...props }/>);
const text = `bold *constrained* & **un**constrained

italic _constrained_ & __un__constrained

bold italic *_constrained_* & **__un__**constrained`;

describe('COMPONENTS - <Asciidoc>', () => {
  test('render Asciidoc', () => {
    const component = setup({ text });

    expect(component).toMatchSnapshot();
  });
});
