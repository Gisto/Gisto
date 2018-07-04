import { isTag } from 'utils/snippets';

describe('UTILS - snippets', () => {
  test('should determin if string is a tag', () => {
    const testString = '#tag3';

    expect(isTag(testString)).toBeTruthy();
  });

  test('should determin if string is not a tag', () => {
    const testString = 'nottag';

    expect(isTag(testString)).toBeFalsy();
  });
});
