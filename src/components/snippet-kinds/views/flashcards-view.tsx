import { RotateCcw, Shuffle } from 'lucide-react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { KindMarkdown } from '@/components/snippet-kinds/kind-markdown.tsx';
import { Button } from '@/components/ui/button.tsx';
import { t } from '@/lib/i18n';
import {
  countdownProgress,
  countdownSeconds,
  FLASHCARD_RATINGS,
  isDue,
  nextReview,
  reviewIntervalLabel,
  FlashcardReview,
} from '@/lib/snippet-kinds/flashcard-review.ts';
import { flashcardKey } from '@/lib/snippet-kinds/flashcards.ts';
import { useKindSaver } from '@/lib/snippet-kinds/use-kind-saver.ts';
import { useKindState } from '@/lib/snippet-kinds/use-kind-state.ts';
import { Flashcard, FlashcardRating, SnippetSingleType } from '@/types/snippet.ts';
import {
  cn,
  findFlashcardsFile,
  MANIFEST_FILENAME,
  parseFlashcards,
  serializeFlashcards,
  serializeManifest,
} from '@/utils';

type RatingMeta = {
  labelKey: string;
  className: string;
  dotClassName: string;
  key: string;
};

/**
 * Grade styling and keyboard shortcut for each rating. Tinted like the rest of
 * the app's chips rather than solid, so grading stays calm.
 */
const RATING_META: Record<FlashcardRating, RatingMeta> = {
  again: {
    labelKey: 'pages.snippet.flashcardsAgain',
    className:
      'border-rose-500/40 bg-rose-500/10 text-rose-700 hover:bg-rose-500/15 dark:text-rose-300',
    dotClassName: 'bg-rose-500',
    key: '1',
  },
  hard: {
    labelKey: 'pages.snippet.flashcardsHard',
    className:
      'border-amber-500/40 bg-amber-500/10 text-amber-700 hover:bg-amber-500/15 dark:text-amber-300',
    dotClassName: 'bg-amber-500',
    key: '2',
  },
  good: {
    labelKey: 'pages.snippet.flashcardsGood',
    className:
      'border-emerald-600/40 bg-emerald-600/10 text-emerald-700 hover:bg-emerald-600/15 dark:text-emerald-300',
    dotClassName: 'bg-emerald-600',
    key: '3',
  },
  easy: {
    labelKey: 'pages.snippet.flashcardsEasy',
    className: 'border-sky-600/40 bg-sky-600/10 text-sky-700 hover:bg-sky-600/15 dark:text-sky-300',
    dotClassName: 'bg-sky-600',
    key: '4',
  },
};

const shuffleCards = (cards: Flashcard[]) => {
  const next = [...cards];
  for (let index = next.length - 1; index > 0; index -= 1) {
    const swap = Math.floor(Math.random() * (index + 1));
    [next[index], next[swap]] = [next[swap], next[index]];
  }
  return next;
};

/** Cards due for review first, then everything else, keeping file order. */
const buildQueue = (cards: Flashcard[], reviews: Record<string, FlashcardReview>): Flashcard[] => {
  const due = cards.filter((card, index) => isDue(reviews[flashcardKey(card, index)]));

  return due.length && due.length < cards.length
    ? [...due, ...cards.filter((card) => !due.includes(card))]
    : cards;
};

const GradeHint = ({ isChoice }: { isChoice: boolean }) => {
  if (isChoice) {
    return (
      <div className="text-center text-xs text-muted-foreground">
        {t('pages.snippet.flashcardsChoiceHint')}
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
      <kbd className="rounded border bg-muted px-1.5 py-0.5">Space</kbd>
      {t('pages.snippet.flashcardsFlipHint')}
    </div>
  );
};

const sessionKey = (card: Flashcard, index: number) => flashcardKey(card, index);

type OptionState = 'idle' | 'selected' | 'correct' | 'wrong';

const optionGlyph = (state: OptionState): string | undefined => {
  if (state === 'correct') return '✓';
  if (state === 'wrong') return '✕';

  return undefined;
};

const optionState = (selected: boolean, correct: boolean, checked: boolean): OptionState => {
  if (checked) {
    if (correct) return 'correct';
    return selected ? 'wrong' : 'idle';
  }

  return selected ? 'selected' : 'idle';
};

export const FlashcardsView = ({
  snippet,
  onUpdated,
}: {
  snippet: SnippetSingleType;
  onUpdated?: (content: string) => void;
}) => {
  // reseeds only when the snippet content changes, never on local progress updates
  const [cards] = useKindState(
    findFlashcardsFile(snippet.files)?.content ?? '',
    snippet.id,
    parseFlashcards
  );
  const parseReviews = useCallback((content: string): Record<string, FlashcardReview> => {
    try {
      const parsed = JSON.parse(content) as { reviews?: Record<string, FlashcardReview> };
      return parsed.reviews ?? {};
    } catch {
      return {};
    }
  }, []);
  const [reviews, setReviews] = useKindState(
    JSON.stringify(snippet.files[MANIFEST_FILENAME]?.content ?? ''),
    `${snippet.id}:reviews`,
    parseReviews
  );

  const { save, saving } = useKindSaver(snippet, 'flashcards', onUpdated);
  const [queue, setQueue] = useState<Flashcard[]>(() => buildQueue(cards, reviews));
  const [flipped, setFlipped] = useState(false);
  const [graded, setGraded] = useState<FlashcardRating[]>([]);
  const [selection, setSelection] = useState<number[]>([]);
  const [checked, setChecked] = useState(false);
  const [tick, setTick] = useState<{ key: string; remainingMs: number } | null>(null);
  const [seededFor, setSeededFor] = useState(snippet.id);

  if (seededFor !== snippet.id) {
    setSeededFor(snippet.id);
    setQueue(buildQueue(cards, reviews));
    setFlipped(false);
    setGraded([]);
    setSelection([]);
    setChecked(false);
  }

  const card = queue[0];
  const total = cards.length;
  const remaining = queue.length;
  const reviewed = Math.max(total - remaining, 0);
  const isChoice = Boolean(card?.options && card.options.length > 1);
  const answerSet = card?.answers ?? [0];
  const isCorrectChoice =
    selection.length === answerSet.length && selection.every((value) => answerSet.includes(value));

  const grade = useCallback(
    (rating: FlashcardRating) => {
      if (!card) return;

      const key = sessionKey(card, cards.indexOf(card));
      const review = nextReview(rating);
      const nextReviews = { ...reviews, [key]: review };

      setReviews(nextReviews);
      setGraded((current) => [...current, rating]);
      setQueue((current) => (rating === 'again' ? [...current.slice(1), card] : current.slice(1)));
      setFlipped(false);
      setSelection([]);
      setChecked(false);

      void save(serializeFlashcards(cards), t('pages.snippet.flashcardsUpdateError'), {
        [MANIFEST_FILENAME]: {
          content: serializeManifest({ type: 'flashcards', reviews: nextReviews }),
        },
      });
    },
    [card, cards, reviews, save, setReviews]
  );

  const gradeRef = useRef(grade);

  useEffect(() => {
    gradeRef.current = grade;
  }, [grade]);

  const limitMs = (card?.timeLimit ?? 0) * 1000;
  const timing = Boolean(card?.timeLimit) && !flipped && !checked;
  const cardKey = card ? sessionKey(card, cards.indexOf(card)) : '';

  // countdown ticks are kept in state with the card they belong to, so a new
  // card always starts from its full limit
  useEffect(() => {
    if (!timing || !card?.timeLimit) return;

    const key = cardKey;
    const total = card.timeLimit * 1000;
    const startedAt = Date.now();
    let expired = false;

    const id = window.setInterval(() => {
      const left = Math.max(total - (Date.now() - startedAt), 0);

      setTick({ key, remainingMs: left });

      if (left === 0 && !expired) {
        expired = true;
        window.clearInterval(id);
        gradeRef.current('again');
      }
    }, 100);

    return () => window.clearInterval(id);
  }, [card, cardKey, timing]);

  const remainingMs = timing && tick?.key === cardKey ? tick.remainingMs : limitMs;

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.metaKey || event.ctrlKey || event.altKey) return;

      if (!flipped) {
        if (isChoice || (event.code !== 'Space' && event.code !== 'Enter')) return;

        event.preventDefault();
        setFlipped(true);
        return;
      }

      const rating = FLASHCARD_RATINGS.find((value) => RATING_META[value].key === event.key);

      if (rating) {
        event.preventDefault();
        grade(rating);
      }
    };

    window.addEventListener('keydown', onKeyDown);

    return () => window.removeEventListener('keydown', onKeyDown);
  }, [flipped, grade, isChoice]);

  const restart = () => {
    setQueue(buildQueue(cards, reviews));
    setFlipped(false);
    setGraded([]);
    setSelection([]);
    setChecked(false);
  };

  const counts = useMemo(
    () =>
      FLASHCARD_RATINGS.map((rating) => ({
        rating,
        count: graded.filter((value) => value === rating).length,
      })),
    [graded]
  );

  if (total === 0) {
    return (
      <div className="flex h-full items-center justify-center p-4 text-sm text-muted-foreground">
        {t('pages.snippet.flashcardsEmpty')}
      </div>
    );
  }

  return (
    <div className="h-full overflow-auto p-4">
      <div className="flex min-h-full items-center justify-center">
        <div className="flex w-full max-w-2xl flex-col gap-4 py-6">
          <div className="flex items-center justify-between gap-2 text-sm text-muted-foreground">
            <span>
              {t('pages.snippet.flashcardsProgress', {
                current: Math.min(reviewed + 1, total),
                total,
              })}
            </span>
            <span>{t('pages.snippet.flashcardsRemaining', { remaining })}</span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-success transition-all"
              style={{ width: `${total ? Math.min(reviewed / total, 1) * 100 : 0}%` }}
            />
          </div>

          {card ? (
            <>
              {timing && (
                <div className="flex items-center justify-end gap-2 text-xs text-muted-foreground">
                  <span className={cn(remainingMs <= 3000 && 'text-rose-600')}>
                    {t('pages.snippet.flashcardsSecondsLeft', {
                      seconds: countdownSeconds(remainingMs),
                    })}
                  </span>
                  <div className="h-1 w-24 overflow-hidden rounded-full bg-muted">
                    <div
                      className={cn(
                        'h-full rounded-full transition-all',
                        remainingMs <= 3000 ? 'bg-rose-500' : 'bg-primary/60'
                      )}
                      style={{ width: `${countdownProgress(remainingMs, limitMs) * 100}%` }}
                    />
                  </div>
                </div>
              )}
              {isChoice ? (
                <div className="flex min-h-56 w-full flex-col items-center justify-center gap-3 rounded-xl border border-border bg-card p-6 text-center">
                  <span className="text-base tracking-wide text-muted-foreground uppercase">
                    {t('pages.snippet.flashcardsFront')}
                  </span>
                  <div className="w-full text-base font-medium">
                    <KindMarkdown text={card.front} className="text-base [&_p]:my-0" />
                  </div>

                  <div className="flex w-full flex-col gap-1.5">
                    {card.options!.map((option, optionIndex) => {
                      const selected = selection.includes(optionIndex);
                      const correct = answerSet.includes(optionIndex);
                      const state = optionState(selected, correct, checked);

                      return (
                        <button
                          key={`${option}-${optionIndex}`}
                          type="button"
                          disabled={checked}
                          onClick={() =>
                            setSelection((current) =>
                              current.includes(optionIndex)
                                ? current.filter((value) => value !== optionIndex)
                                : [...current, optionIndex]
                            )
                          }
                          className={cn(
                            'flex w-full cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 text-left text-sm transition-colors disabled:cursor-default',
                            state === 'idle' && 'border-border hover:border-primary/40',
                            state === 'selected' && 'border-primary bg-primary/10',
                            state === 'correct' && 'border-emerald-600 bg-emerald-600/10',
                            state === 'wrong' && 'border-rose-600 bg-rose-600/10'
                          )}
                        >
                          <span
                            className={cn(
                              'flex size-4 shrink-0 items-center justify-center rounded-full border text-[10px]',
                              state === 'correct' && 'border-emerald-600 text-emerald-600',
                              state === 'wrong' && 'border-rose-600 text-rose-600'
                            )}
                          >
                            {optionGlyph(state)}
                          </span>
                          <KindMarkdown text={option} inline className="text-sm [&_p]:my-0" />
                        </button>
                      );
                    })}
                  </div>

                  {!checked ? (
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={selection.length === 0}
                      onClick={() => {
                        setChecked(true);
                        setFlipped(true);
                      }}
                    >
                      {t('pages.snippet.flashcardsCheck')}
                    </Button>
                  ) : (
                    <p
                      className={cn(
                        'text-xs',
                        isCorrectChoice ? 'text-emerald-600' : 'text-rose-600'
                      )}
                    >
                      {t(
                        isCorrectChoice
                          ? 'pages.snippet.flashcardsCorrect'
                          : 'pages.snippet.flashcardsIncorrect'
                      )}
                    </p>
                  )}
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setFlipped((value) => !value)}
                  aria-label={t('pages.snippet.flashcardsFlip')}
                  aria-pressed={flipped}
                  className="group w-full cursor-pointer [perspective:1200px]"
                >
                  <div
                    className={cn(
                      'relative grid min-h-56 w-full transition-transform duration-500 [transform-style:preserve-3d] motion-reduce:transition-none',
                      flipped && '[transform:rotateY(180deg)]'
                    )}
                  >
                    <div className="col-start-1 row-start-1 flex flex-col items-center justify-center gap-3 rounded-xl border border-border bg-card p-6 text-center [backface-visibility:hidden] group-hover:border-primary/30">
                      <span className="text-base tracking-wide text-muted-foreground uppercase">
                        {t('pages.snippet.flashcardsFront')}
                      </span>
                      <span className="w-full text-base font-medium">
                        <KindMarkdown text={card.front} className="text-base [&_p]:my-0" />
                      </span>
                      {card.back.trim() && (
                        <span className="text-xs text-muted-foreground">
                          {t('pages.snippet.flashcardsTapToReveal')}
                        </span>
                      )}
                    </div>

                    <div className="col-start-1 row-start-1 flex flex-col items-center justify-center gap-3 rounded-xl border border-primary/50 bg-primary/5 p-6 text-center [backface-visibility:hidden] [transform:rotateY(180deg)]">
                      <span className="text-[10px] tracking-wide text-muted-foreground uppercase">
                        {t('pages.snippet.flashcardsBack')}
                      </span>
                      <span className="w-full text-base font-medium">
                        <KindMarkdown
                          text={card.back.trim() ? card.back : card.front}
                          className="text-base [&_p]:my-0"
                        />
                      </span>
                    </div>
                  </div>
                </button>
              )}

              {!flipped ? (
                <GradeHint isChoice={isChoice} />
              ) : (
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                  {FLASHCARD_RATINGS.map((rating) => (
                    <button
                      key={rating}
                      type="button"
                      disabled={saving}
                      onClick={() => grade(rating)}
                      className={cn(
                        'flex cursor-pointer flex-col items-center gap-0.5 rounded-lg border px-3 py-2 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50',
                        RATING_META[rating].className
                      )}
                    >
                      <span className="flex items-center gap-1.5">
                        <span
                          className={cn('size-1.5 rounded-full', RATING_META[rating].dotClassName)}
                        />
                        {t(RATING_META[rating].labelKey)}
                      </span>
                      <span className="text-[10px] opacity-70">
                        {reviewIntervalLabel(rating)} · {RATING_META[rating].key}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="flex flex-col items-center gap-3 rounded-xl border border-border bg-card p-8 text-center">
              <p className="text-sm text-muted-foreground">
                {t('pages.snippet.flashcardsSessionDone')}
              </p>
              <div className="flex flex-wrap items-center justify-center gap-2 text-xs">
                {counts.map(({ rating, count }) => (
                  <span
                    key={rating}
                    className={cn(
                      'rounded-full border px-2 py-0.5 text-xs',
                      RATING_META[rating].className
                    )}
                  >
                    {t(RATING_META[rating].labelKey)}: {count}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="flex items-center justify-between gap-2">
            <span className="text-xs text-muted-foreground">
              {t('pages.snippet.flashcardsReviewed', { done: reviewed, total })}
            </span>

            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  setQueue(shuffleCards(queue));
                  setFlipped(false);
                }}
                aria-label={t('pages.snippet.flashcardsShuffle')}
              >
                <Shuffle className="size-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={restart}
                aria-label={t('pages.snippet.flashcardsReset')}
                disabled={reviewed === 0}
              >
                <RotateCcw className="size-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
