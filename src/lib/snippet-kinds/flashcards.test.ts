import { countdownProgress, countdownSeconds } from './flashcard-review.ts';
import { flashcardKey, parseFlashcards, serializeFlashcards } from './flashcards.ts';

import { Flashcard } from '@/types/snippet.ts';

describe('flashcardKey', () => {
  it('is stable for the same card text across parses', () => {
    const [first] = parseFlashcards(JSON.stringify({ cards: [{ front: 'Q', back: 'A' }] }));
    const [second] = parseFlashcards(JSON.stringify({ cards: [{ front: 'Q', back: 'A' }] }));

    expect(flashcardKey(first)).toBe(flashcardKey(second));
  });

  it('differs for different fronts', () => {
    const a: Flashcard = { id: 'x', front: 'Q1', back: 'A' };
    const b: Flashcard = { id: 'x', front: 'Q2', back: 'A' };

    expect(flashcardKey(a)).not.toBe(flashcardKey(b));
  });

  it('trims surrounding whitespace before keying', () => {
    const a: Flashcard = { id: '1', front: ' Q ', back: 'A' };
    const b: Flashcard = { id: '2', front: 'Q', back: 'A' };

    expect(flashcardKey(a)).toBe(flashcardKey(b));
  });

  it('falls back to position when the front is empty', () => {
    const card: Flashcard = { id: '1', front: '', back: 'A' };

    expect(flashcardKey(card, 3)).toBe('#3');
  });
});

describe('multiple choice cards', () => {
  it('keeps choices and correct answers across a round trip', () => {
    const [card] = parseFlashcards(
      JSON.stringify({
        cards: [
          {
            front: 'Pick the even number',
            back: '2',
            options: ['1', ' 2 ', '3', '2', ''],
            answers: [1, 1, 9, -1],
          },
        ],
      })
    );

    expect(card.options).toEqual(['1', '2', '3']);
    expect(card.answers).toEqual([1]);

    const [reparsed] = parseFlashcards(serializeFlashcards([card]));

    expect(reparsed.options).toEqual(['1', '2', '3']);
    expect(reparsed.answers).toEqual([1]);
  });

  it('defaults the correct answer to the first choice', () => {
    const [card] = parseFlashcards(
      JSON.stringify({ cards: [{ front: 'Q', options: ['a', 'b'], answers: [] }] })
    );

    expect(card.answers).toEqual([0]);
  });

  it('drops choices when fewer than two remain', () => {
    const [card] = parseFlashcards(
      JSON.stringify({ cards: [{ front: 'Q', options: ['only'], answers: [0] }] })
    );

    expect(card.options).toBeUndefined();
    expect(card.answers).toBeUndefined();
  });

  it('keeps plain cards untouched', () => {
    const [card] = parseFlashcards(JSON.stringify({ cards: [{ front: 'Q', back: 'A' }] }));

    expect(card.options).toBeUndefined();
    expect(JSON.parse(serializeFlashcards([card])).cards[0]).toEqual({ front: 'Q', back: 'A' });
  });
});

describe('card time limits', () => {
  it('round trips a positive limit', () => {
    const [card] = parseFlashcards(
      JSON.stringify({ cards: [{ front: 'Q', back: 'A', timeLimit: 12 }] })
    );

    expect(card.timeLimit).toBe(12);
    expect(JSON.parse(serializeFlashcards([card])).cards[0].timeLimit).toBe(12);
  });

  it('ignores missing or invalid limits', () => {
    const [missing] = parseFlashcards(JSON.stringify({ cards: [{ front: 'Q', back: 'A' }] }));
    const [invalid] = parseFlashcards(
      JSON.stringify({ cards: [{ front: 'Q', back: 'A', timeLimit: 0 }] })
    );
    const [negative] = parseFlashcards(
      JSON.stringify({ cards: [{ front: 'Q', back: 'A', timeLimit: -5 }] })
    );

    expect(missing.timeLimit).toBeUndefined();
    expect(invalid.timeLimit).toBeUndefined();
    expect(negative.timeLimit).toBeUndefined();
    expect(JSON.parse(serializeFlashcards([missing])).cards[0].timeLimit).toBeUndefined();
  });
});

describe('countdown helpers', () => {
  it('rounds remaining milliseconds up to whole seconds', () => {
    expect(countdownSeconds(12000)).toBe(12);
    expect(countdownSeconds(1)).toBe(1);
    expect(countdownSeconds(0)).toBe(0);
    expect(countdownSeconds(-500)).toBe(0);
  });

  it('reports the fraction of the limit left', () => {
    expect(countdownProgress(5000, 10000)).toBe(0.5);
    expect(countdownProgress(0, 10000)).toBe(0);
    expect(countdownProgress(20000, 10000)).toBe(1);
    expect(countdownProgress(5000, 0)).toBe(0);
  });
});
