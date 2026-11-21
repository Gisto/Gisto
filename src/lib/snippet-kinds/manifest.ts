import { isSpecialSnippetKindsEnabled } from '@/lib/feature-flags.ts';
import { isFlashcardRating, FlashcardReview } from '@/lib/snippet-kinds/flashcard-review.ts';
import { SnippetFileType, SNIPPET_KINDS, SnippetKind } from '@/types/snippet.ts';

export const MANIFEST_FILENAME = '.config-manifest.json';

/** Presentation hint for docs: numbered procedure or grouped reference. */
export type DocMode = 'ordered' | 'reference';

export type Manifest = {
  type: SnippetKind;
  /** doc only: present entries as a numbered procedure instead of grouped reference */
  ordered?: boolean;
  /** doc + ordered only: titles of completed steps, kept out of the markdown body */
  done?: string[];
  /** flashcards only: spaced repetition state, keyed by card key */
  reviews?: Record<string, FlashcardReview>;
};

const parseReviews = (value: unknown): Record<string, FlashcardReview> | undefined => {
  if (!value || typeof value !== 'object') return undefined;

  const entries = Object.entries(value as Record<string, unknown>).flatMap(([key, review]) => {
    if (!review || typeof review !== 'object') return [];

    const { rating, due } = review as { rating?: unknown; due?: unknown };

    return isFlashcardRating(rating) && typeof due === 'string'
      ? [[key, { rating, due }] as const]
      : [];
  });

  return entries.length ? Object.fromEntries(entries) : undefined;
};

const parseManifest = (content?: string): Manifest | null => {
  if (!content) return null;

  try {
    const manifest = JSON.parse(content) as {
      type?: unknown;
      ordered?: unknown;
      done?: unknown;
      reviews?: unknown;
    };
    return typeof manifest.type === 'string' &&
      (SNIPPET_KINDS as readonly string[]).includes(manifest.type)
      ? {
          type: manifest.type as SnippetKind,
          ordered: manifest.ordered === true,
          done: Array.isArray(manifest.done)
            ? manifest.done.filter((title): title is string => typeof title === 'string')
            : [],
          reviews: parseReviews(manifest.reviews),
        }
      : null;
  } catch {
    return null;
  }
};

export const serializeManifest = (manifest: Manifest): string => {
  const body: Record<string, unknown> = { type: manifest.type };

  if (manifest.ordered !== undefined) {
    body.ordered = manifest.ordered;
  }

  if (manifest.done && manifest.done.length > 0) {
    body.done = manifest.done;
  }

  if (manifest.reviews && Object.keys(manifest.reviews).length > 0) {
    body.reviews = manifest.reviews;
  }

  return JSON.stringify(body, null, 2);
};

export const findManifestFile = (
  files: Record<string, SnippetFileType>
): SnippetFileType | undefined =>
  Object.values(files).find((file) => file.filename === MANIFEST_FILENAME);

export const getManifest = (files: Record<string, SnippetFileType>): Manifest | null =>
  parseManifest(findManifestFile(files)?.content);

export const getSnippetKind = (files: Record<string, SnippetFileType>): SnippetKind =>
  getManifest(files)?.type ?? 'snippet';

/**
 * Kind shown in the UI. Structured kinds only surface when their feature flag is
 * enabled, so a disabled flag degrades them to plain snippets.
 */
export const getVisibleSnippetKind = (files: Record<string, SnippetFileType>): SnippetKind =>
  isSpecialSnippetKindsEnabled() ? getSnippetKind(files) : 'snippet';

/** Ordered docs are procedures; reference docs are grouped lookups. */
export const isOrderedDoc = (files: Record<string, SnippetFileType>): boolean =>
  getManifest(files)?.ordered === true;

export const getDocDone = (files: Record<string, SnippetFileType>): string[] =>
  getManifest(files)?.done ?? [];

export const getCardReviews = (
  files: Record<string, SnippetFileType>
): Record<string, FlashcardReview> => getManifest(files)?.reviews ?? {};
