import { FlashcardRating } from '@/types/snippet.ts';

const DAY_MS = 24 * 60 * 60 * 1000;

/** Session requeue delay for a forgotten card, in minutes. */
export const AGAIN_DELAY_MINUTES = 10;

export const FLASHCARD_RATINGS: FlashcardRating[] = ['again', 'hard', 'good', 'easy'];

/** Spaced-repetition intervals, in days. `again` is handled in-session. */
export const RATING_INTERVAL_DAYS: Record<FlashcardRating, number> = {
  again: 0,
  hard: 1,
  good: 3,
  easy: 7,
};

export const isFlashcardRating = (value: unknown): value is FlashcardRating =>
  typeof value === 'string' && (FLASHCARD_RATINGS as string[]).includes(value);

export type FlashcardReview = { rating: FlashcardRating; due: string };

/** Next review for a rating: forgotten cards come back in-session, others in days. */
export const nextReview = (rating: FlashcardRating, from: Date = new Date()): FlashcardReview => {
  const due =
    rating === 'again'
      ? new Date(from.getTime() + AGAIN_DELAY_MINUTES * 60 * 1000)
      : new Date(from.getTime() + RATING_INTERVAL_DAYS[rating] * DAY_MS);

  return { rating, due: due.toISOString() };
};

/** Human readable interval, e.g. `10m`, `1d`, `7d`. */
export const reviewIntervalLabel = (rating: FlashcardRating): string =>
  rating === 'again' ? `${AGAIN_DELAY_MINUTES}m` : `${RATING_INTERVAL_DAYS[rating]}d`;

export const isDue = (review: FlashcardReview | undefined, now: Date = new Date()): boolean =>
  !review || new Date(review.due).getTime() <= now.getTime();

/** Whole seconds left, rounded up, for the countdown label. */
export const countdownSeconds = (remainingMs: number): number =>
  Math.max(Math.ceil(remainingMs / 1000), 0);

/** Fraction of the limit left, for the countdown bar. */
export const countdownProgress = (remainingMs: number, limitMs: number): number =>
  limitMs > 0 ? Math.min(Math.max(remainingMs / limitMs, 0), 1) : 0;
