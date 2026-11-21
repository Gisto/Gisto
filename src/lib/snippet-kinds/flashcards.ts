import { findKindFile, KIND_FILENAMES } from './registry.ts';

import { Flashcard, SnippetFileType } from '@/types/snippet.ts';

export const FLASHCARDS_FILENAME = KIND_FILENAMES.flashcards;

/**
 * Stable key for a card. Parsing mints a fresh id, so progress is keyed by the
 * front text (trimmed) with a positional fallback for empty fronts.
 */
export const flashcardKey = (card: Flashcard, index = 0): string =>
  card.front.trim() || `#${index}`;

const parseCard = (card: unknown): Flashcard | null => {
  if (typeof card === 'string') {
    const front = card.trim();
    return front ? { id: crypto.randomUUID(), front, back: '' } : null;
  }
  if (!card || typeof card !== 'object') return null;

  const { front, back, options, answers, timeLimit } = card as {
    front?: unknown;
    back?: unknown;
    options?: unknown;
    answers?: unknown;
    timeLimit?: unknown;
  };
  const parsed = {
    front: typeof front === 'string' ? front : '',
    back: typeof back === 'string' ? back : '',
  };
  const choices = Array.isArray(options)
    ? Array.from(
        new Set(
          options
            .filter((option): option is string => typeof option === 'string')
            .map((option) => option.trim())
            .filter(Boolean)
        )
      )
    : [];
  const correct = Array.isArray(answers)
    ? Array.from(
        new Set(
          answers.filter(
            (answer): answer is number =>
              typeof answer === 'number' && Number.isInteger(answer) && answer >= 0
          )
        )
      ).filter((answer) => answer < choices.length)
    : [];

  const limit =
    typeof timeLimit === 'number' && Number.isFinite(timeLimit) && timeLimit > 0
      ? Math.round(timeLimit)
      : undefined;

  return parsed.front.trim() || parsed.back.trim() || choices.length
    ? {
        id: crypto.randomUUID(),
        ...parsed,
        ...(choices.length > 1 ? { options: choices } : {}),
        ...(choices.length > 1 ? { answers: correct.length ? correct : [0] } : {}),
        ...(limit ? { timeLimit: limit } : {}),
      }
    : null;
};

export const parseFlashcards = (content: string): Flashcard[] => {
  try {
    const data = JSON.parse(content) as unknown;

    if (Array.isArray(data)) {
      return data.flatMap((card) => parseCard(card) ?? []);
    }

    if (data && typeof data === 'object') {
      const { cards } = data as { cards?: unknown };
      if (Array.isArray(cards)) {
        return cards.flatMap((card) => parseCard(card) ?? []);
      }
    }

    return [];
  } catch {
    return [];
  }
};

export const serializeFlashcards = (cards: Flashcard[]): string =>
  JSON.stringify(
    {
      cards: cards
        .map((card) => ({
          front: card.front.trim(),
          back: card.back.trim(),
          ...(card.timeLimit ? { timeLimit: card.timeLimit } : {}),
          ...(card.options && card.options.length > 1
            ? {
                options: card.options.map((option) => option.trim()).filter(Boolean),
                answers: (card.answers ?? [0]).filter(
                  (answer) => answer >= 0 && answer < card.options!.length
                ),
              }
            : {}),
        }))
        .filter((card) => card.front || card.back),
    },
    null,
    2
  );

export const findFlashcardsFile = (
  files: Record<string, SnippetFileType>
): SnippetFileType | undefined => findKindFile(files, 'flashcards');
