import { guessLanguage, guessMimeType } from './snippet-utils.ts';

describe('snippet-utils', () => {
  describe('guessLanguage', () => {
    it('resolves common extensions to their language', () => {
      expect(guessLanguage('js')).toBe('JavaScript');
      expect(guessLanguage('markdown')).toBe('Markdown');
      expect(guessLanguage('xml')).toBe('XML');
    });

    it('resolves the primary extension of every language', () => {
      expect(guessLanguage('adb')).toBe('Ada');
      expect(guessLanguage('zep')).toBe('Zephir');
      expect(guessLanguage('m')).toBe('Mercury');
    });

    it('resolves extensions appended for renamed or removed Linguist languages', () => {
      expect(guessLanguage('zeek')).toBe('Bro');
      expect(guessLanguage('vim')).toBe('VimL');
      expect(guessLanguage('raku')).toBe('Perl6');
      expect(guessLanguage('coq')).toBe('Coq');
    });

    it('resolves non-primary extension aliases that Gisto can append', () => {
      expect(guessLanguage('mjs')).toBe('JavaScript');
      expect(guessLanguage('cjs')).toBe('JavaScript');
      expect(guessLanguage('mts')).toBe('TypeScript');
      expect(guessLanguage('cts')).toBe('TypeScript');
      expect(guessLanguage('tsx')).toBe('TSX');
      expect(guessLanguage('jsx')).toBe('JSX');
      expect(guessLanguage('csv')).toBe('CSV');
      expect(guessLanguage('pdf')).toBe('PDF');
    });

    it('falls back to Text for unknown extensions', () => {
      expect(guessLanguage('zzz')).toBe('Text');
    });
  });

  describe('guessMimeType', () => {
    it('returns the mime type for known extensions', () => {
      expect(guessMimeType('pdf')).toBe('application/pdf');
    });

    it('falls back to text/plain', () => {
      expect(guessMimeType('zzz')).toBe('text/plain');
    });
  });
});
