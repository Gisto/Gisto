import { isTag, filterSnippetsList } from 'utils/snippets';
import { snippetStructure } from 'utils/prepareSnippet';
import { snippet } from '__mocks__/snippets';

describe('UTILS - snippets', () => {
  test('should determin if string is a tag', () => {
    const testString = '#tag3';

    expect(isTag(testString)).toBeTruthy();
  });

  test('should determin if string is not a tag', () => {
    const testString = 'nottag';

    expect(isTag(testString)).toBeFalsy();
  });

  test('should filter snippet by (not existing text) text', () => {
    const snippets = [
      snippetStructure(snippet({ description: 'some #tag1 #tag2' })),
      snippetStructure(snippet({ description: 'word #tag1 #tag2' })),
      snippetStructure(snippet({ description: 'to find #tag3 #tag4 #tag5' }))
    ];

    expect(filterSnippetsList(snippets, 'gbrlsskdl').length).toEqual(0);
  });

  test('should filter snippet by "some" text', () => {
    const snippets = [
      snippetStructure(snippet({ description: 'some #tag1 #tag2' })),
      snippetStructure(snippet({ description: 'word #tag1 #tag2' })),
      snippetStructure(snippet({ description: 'word to find #tag3 #tag4 #tag5' }))
    ];

    expect(filterSnippetsList(snippets, 'some').length).toEqual(1);
  });

  test('should filter snippet by tags', () => {
    const snippets = [
      snippetStructure(snippet({ description: 'some #tag1 #tag2' })),
      snippetStructure(snippet({ description: 'word #tag1 #tag2' })),
      snippetStructure(snippet({ description: 'word to find #tag3 #tag4 #tag5' }))
    ];

    // filter by 1 tag
    expect(filterSnippetsList(snippets, '', ['#tag3'], '').length).toEqual(1);
    // Filter by free text which is tag matching 2 snippets
    expect(filterSnippetsList(snippets, '#tag2', '', '').length).toEqual(2);
    // filter by 1 tag matching 2 snippets
    expect(filterSnippetsList(snippets, '', ['#tag2'], '').length).toEqual(2);
    // filter by 2 tags
    expect(filterSnippetsList(snippets, '', ['#tag3', '#tag4'], '').length).toEqual(1);
  });

  test('should filter snippet by "HTML" language', () => {
    const files = ({
      files: {
        'ehlo.txt': {
          filename: 'ehlo.txt',
          type: 'text/plain',
          language: 'Text',
          size: 6
        },
        'ehlo.html': {
          filename: 'ehlo.html',
          type: 'text/html',
          language: 'HTML',
          size: 6
        }
      }
    });
    const snippets = [
      snippetStructure(snippet({ description: 'some #tag1 #tag2'})),
      snippetStructure(snippet({ description: 'word #tag1 #tag2', ...files })),
      snippetStructure(snippet({ description: 'word to find #tag3 #tag4 #tag5' }))
    ];

    expect(filterSnippetsList(snippets, '', '', 'HTML').length).toEqual(1);
  });
});
