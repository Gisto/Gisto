import { BookOpen, FileText, GalleryVerticalEnd, ListTodo, SquareKanban } from 'lucide-react';

import type { LucideIcon } from 'lucide-react';

import {
  KIND_FILENAMES,
  KIND_LANGUAGES,
  STRUCTURED_SNIPPET_KINDS,
} from '@/lib/snippet-kinds/registry.ts';
import { SnippetKind, StructuredSnippetKind } from '@/types/snippet.ts';

export type KindMeta = {
  /** i18n key for the kind label, also used by list badges and tooltips */
  labelKey: string;
  /** i18n key for the "add at least one item" validation error */
  emptyErrorKey: string;
  /** i18n key used by the AI assistant and editor counters */
  icon: LucideIcon;
  /** data file name, absent for plain snippets */
  filename?: string;
  /** data file language, absent for plain snippets */
  language?: string;
  /** editor gets the wide two-column layout */
  wide: boolean;
  /** kind can be toggled between ordered steps and grouped reference */
  supportsOrdering?: boolean;
};

export const KIND_META: Record<SnippetKind, KindMeta> = {
  snippet: {
    labelKey: 'common.snippet',
    emptyErrorKey: 'pages.new.descriptionError',
    icon: FileText,
    wide: false,
  },
  todo: {
    labelKey: 'common.todo',
    emptyErrorKey: 'pages.new.todoEmptyError',
    icon: ListTodo,
    filename: KIND_FILENAMES.todo,
    language: KIND_LANGUAGES.todo,
    wide: false,
  },
  kanban: {
    labelKey: 'common.kanban',
    emptyErrorKey: 'pages.new.kanbanEmptyError',
    icon: SquareKanban,
    filename: KIND_FILENAMES.kanban,
    language: KIND_LANGUAGES.kanban,
    wide: true,
  },
  doc: {
    labelKey: 'common.doc',
    emptyErrorKey: 'pages.new.docEmptyError',
    icon: BookOpen,
    filename: KIND_FILENAMES.doc,
    language: KIND_LANGUAGES.doc,
    wide: true,
    supportsOrdering: true,
  },
  flashcards: {
    labelKey: 'common.flashcards',
    emptyErrorKey: 'pages.new.flashcardsEmptyError',
    icon: GalleryVerticalEnd,
    filename: KIND_FILENAMES.flashcards,
    language: KIND_LANGUAGES.flashcards,
    wide: false,
  },
};

export const getKindMeta = (kind: SnippetKind): KindMeta => KIND_META[kind];

/** Structured kinds in display order, used for the type tabs. */
export const structuredKinds = (): StructuredSnippetKind[] => STRUCTURED_SNIPPET_KINDS;

export const kindLabelKey = (kind: SnippetKind): string => getKindMeta(kind).labelKey;

export const kindEmptyErrorKey = (kind: SnippetKind): string => getKindMeta(kind).emptyErrorKey;
