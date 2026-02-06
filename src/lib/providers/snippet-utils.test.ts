import { buildGitlabDescription, guessLanguage, guessMimeType } from './snippet-utils';

describe('snippet-utils', () => {
  describe('guessMimeType', () => {
    it('returns a known mime type', () => {
      expect(guessMimeType('json')).toBe('application/json');
    });

    it('falls back to text/plain', () => {
      expect(guessMimeType('unknown')).toBe('text/plain');
    });
  });

  describe('guessLanguage', () => {
    it('returns a known language label', () => {
      expect(guessLanguage('ts')).toBe('TypeScript');
    });

    it('falls back to Text', () => {
      expect(guessLanguage('unknown')).toBe('Text');
    });
  });

  describe('buildGitlabDescription', () => {
    it('returns the title when description is empty', () => {
      expect(buildGitlabDescription('Title', '')).toBe('Title');
    });

    it('uses description when it already contains the title', () => {
      expect(buildGitlabDescription('Title', 'Title and more')).toBe('Title and more');
    });

    it('combines title and description when distinct', () => {
      expect(buildGitlabDescription('Title', 'Details')).toBe('Title\nDetails');
    });

    it('handles truncated titles when description includes full title', () => {
      expect(buildGitlabDescription('Title...', 'Title with more text')).toBe(
        'Title with more text'
      );
    });
  });
});
