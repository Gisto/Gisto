import { ArrowDownUp, Check, Plus, Trash } from 'lucide-react';
import { useState } from 'react';
import { z } from 'zod';

import { ActionType } from '@/components/layout/pages/create-or-edit-snippet/reducer.ts';
import { EDITOR_ITEM_CARD } from '@/components/snippet-kinds/editors/editor-card.ts';
import { Button } from '@/components/ui/button.tsx';
import { Input } from '@/components/ui/input.tsx';
import { Textarea } from '@/components/ui/textarea';
import { ZodError } from '@/components/zod-error.tsx';
import { t } from '@/lib/i18n';
import { Flashcard } from '@/types/snippet.ts';
import { cn } from '@/utils';

type Props = {
  cards: Flashcard[];
  dispatch: React.Dispatch<ActionType>;
  errors: z.ZodIssue[];
};

const CardOptions = ({
  card,
  onChange,
}: {
  card: Flashcard;
  onChange: (patch: Partial<Flashcard>) => void;
}) => {
  // rows are staged locally so the first choice can be added before there are two
  const [draft, setDraft] = useState<string[] | null>(null);
  const options = draft ?? card.options ?? [];
  const answers = card.answers ?? [];

  const update = (next: string[], nextAnswers: number[]) => {
    setDraft(next);

    if (next.length < 2) {
      onChange({ options: undefined, answers: undefined });
      return;
    }

    const valid = nextAnswers.filter((answer) => answer >= 0 && answer < next.length);

    onChange({ options: next, answers: valid.length ? valid : [0] });
  };

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs text-muted-foreground">{t('pages.new.cardOptions')}</span>
        <Button
          variant="ghost"
          size="xs"
          onClick={() => update([...options, ''], answers)}
          aria-label={t('pages.new.addOption')}
        >
          <Plus className="size-3.5" />
          {t('pages.new.addOption')}
        </Button>
      </div>

      {options.length === 0 ? (
        <p className="text-xs text-muted-foreground">{t('pages.new.cardOptionsHint')}</p>
      ) : (
        options.map((option, index) => {
          const correct = answers.includes(index);

          return (
            <div key={index} className="flex items-center gap-1">
              <Input
                value={option}
                onChange={(event) =>
                  update(
                    options.map((value, position) =>
                      position === index ? event.target.value : value
                    ),
                    answers
                  )
                }
                placeholder={t('pages.new.optionPlaceholder')}
                className="h-8 text-sm"
                aria-label={t('pages.new.optionPlaceholder')}
              />
              <Button
                variant={correct ? 'default' : 'outline'}
                size="icon"
                aria-pressed={correct}
                aria-label={t('pages.new.markCorrect')}
                onClick={() =>
                  update(
                    options,
                    correct ? answers.filter((value) => value !== index) : [...answers, index]
                  )
                }
              >
                <Check className="size-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                aria-label={t('common.delete')}
                onClick={() =>
                  update(
                    options.filter((_, position) => position !== index),
                    answers
                      .filter((value) => value !== index)
                      .map((value) => (value > index ? value - 1 : value))
                  )
                }
              >
                <Trash className="size-4" />
              </Button>
            </div>
          );
        })
      )}
    </div>
  );
};

export const FlashcardsEditor = ({ cards, dispatch, errors }: Props) => (
  <div className="flex flex-col gap-3">
    <label className="text-sm font-medium text-primary flex gap-2">
      {t('pages.new.flashcards')} <ZodError errors={errors} path="files.0.content" />
    </label>

    {cards.map((card) => (
      <div key={card.id} className={cn('flex flex-col gap-2', EDITOR_ITEM_CARD)}>
        <div className="flex items-center justify-between gap-2 text-xs text-muted-foreground">
          <span className="flex items-center gap-2">
            <ArrowDownUp className="size-3.5" />
            {t('pages.new.flashcardPair')}
          </span>
          {card.options && card.options.length > 1 && (
            <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] text-primary">
              {t('pages.new.cardChoiceBadge')}
            </span>
          )}
        </div>

        <div className="flex items-start gap-2">
          <Textarea
            value={card.front}
            onChange={(event) =>
              dispatch({
                type: 'SET_FLASHCARD',
                payload: { id: card.id, patch: { front: event.target.value } },
              })
            }
            placeholder={t('pages.new.flashcardFront')}
            rows={2}
            aria-label={t('pages.new.flashcardFront')}
          />
          <Button
            variant="outline"
            size="icon"
            onClick={() => dispatch({ type: 'REMOVE_FLASHCARD', payload: card.id })}
            aria-label={t('pages.new.removeCard')}
          >
            <Trash className="size-4" />
          </Button>
        </div>

        <Textarea
          value={card.back}
          onChange={(event) =>
            dispatch({
              type: 'SET_FLASHCARD',
              payload: { id: card.id, patch: { back: event.target.value } },
            })
          }
          placeholder={t('pages.new.flashcardBack')}
          rows={2}
          aria-label={t('pages.new.flashcardBack')}
        />

        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">{t('pages.new.cardTimeLimit')}</span>
          <Input
            type="number"
            min={0}
            inputMode="numeric"
            value={card.timeLimit ?? ''}
            onChange={(event) => {
              const seconds = Number(event.target.value);

              dispatch({
                type: 'SET_FLASHCARD',
                payload: {
                  id: card.id,
                  patch: {
                    timeLimit:
                      Number.isFinite(seconds) && seconds > 0 ? Math.round(seconds) : undefined,
                  },
                },
              });
            }}
            placeholder="—"
            className="h-8 w-20 text-sm"
            aria-label={t('pages.new.cardTimeLimit')}
          />
          <span className="text-xs text-muted-foreground">{t('pages.new.secondsShort')}</span>
        </div>

        <CardOptions
          card={card}
          onChange={(patch) =>
            dispatch({
              type: 'SET_FLASHCARD',
              payload: { id: card.id, patch },
            })
          }
        />
      </div>
    ))}

    <Button
      variant="outline"
      className="self-start"
      onClick={() => dispatch({ type: 'ADD_FLASHCARD' })}
    >
      <Plus className="size-4" />
      {t('pages.new.addCard')}
    </Button>
  </div>
);
