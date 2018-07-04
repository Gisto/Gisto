import { removeTags } from 'utils/tags';

describe('UTILS - tags', () => {
  test('should remove tags from string', () => {
    const description = 'This is my description #tag1 #tag2 #tag3';

    expect(removeTags(description)).toBe('This is my description');
  });

  test('should just return string if no tags matched', () => {
    const description = 'This is my description';

    expect(removeTags(description)).toBe('This is my description');
  });

  test('should just return null if string not supplied', () => {
    expect(removeTags(undefined)).toBeNull();
  });
});
