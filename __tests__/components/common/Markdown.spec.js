import { Markdown } from 'components/common/editor/Markdown';

const setup = (props) => shallow(<Markdown { ...props }/>);
const text = '#hello' +
  '\n' +
  'Paragraph **with** _stuff_' +
  '\n' +
  '```' + '\n' +
  'code' + '\n' +
  '```' + '\n' +
  '\n' +
  '> quote' +
  '\n' +
  '[link](https://wwww.gistoapp.com)';

const textWithEmoji = `${text} :100:`;

describe('COMPONENTS - <Markdown>', () => {
  test('render Markdown', () => {
    const component = setup({
      text
    });

    expect(component).toMatchSnapshot();
  });

  test('render Markdown with emoji', () => {
    const component = setup({
      text: textWithEmoji,
      emoji: ({
        100: 'https://dummy-emoji.url'
      })
    });

    expect(component).toMatchSnapshot();
  });
});
