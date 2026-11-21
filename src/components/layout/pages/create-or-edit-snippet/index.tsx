import { useRouter } from 'dirty-react-router';
import { Plus, SidebarClose, SidebarOpen, Shield, ShieldCheck } from 'lucide-react';
import { useEffect, useReducer, useRef, useState } from 'react';
import { z } from 'zod';

import { AiAssistantButton } from '@/components/layout/pages/create-or-edit-snippet/ai-assistant-button.tsx';
import { DropZoneOverlay } from '@/components/layout/pages/create-or-edit-snippet/drop-zone-overlay.tsx';
import { KindEditor } from '@/components/layout/pages/create-or-edit-snippet/kind-editor.tsx';
import {
  kindContent,
  kindCounterLabel,
} from '@/components/layout/pages/create-or-edit-snippet/kind-form.ts';
import {
  MissingExtensionDialog,
  MissingExtensionFile,
} from '@/components/layout/pages/create-or-edit-snippet/missing-extension-dialog.tsx';
import { initialState, reducer } from '@/components/layout/pages/create-or-edit-snippet/reducer.ts';
import { SnippetSchema } from '@/components/layout/pages/create-or-edit-snippet/schema.ts';
import {
  TagsSection,
  TagsSectionLabel,
} from '@/components/layout/pages/create-or-edit-snippet/tags-section.tsx';
import { FileUploadButton } from '@/components/layout/pages/create-or-edit-snippet/upload-file-button.tsx';
import { PageContent } from '@/components/layout/pages/page-content.tsx';
import { PageHeader } from '@/components/layout/pages/page-header.tsx';
import { getKindMeta, structuredKinds } from '@/components/snippet-kinds/kind-meta.ts';
import { toast } from '@/components/toast';
import { Button } from '@/components/ui/button.tsx';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs.tsx';
import { Textarea } from '@/components/ui/textarea';
import { ZodError } from '@/components/zod-error.tsx';
import { t } from '@/lib/i18n';
import { snippetService } from '@/lib/providers/snippet-service.ts';
import { isKanbanCard } from '@/lib/snippet-kinds/kanban.ts';
import { useStoreValue } from '@/lib/store/globalState.ts';
import { SnippetKind, SnippetSingleType } from '@/types/snippet.ts';
import {
  findDocFile,
  findFlashcardsFile,
  findKanbanFile,
  findTodoFile,
  formatSnippetForSaving,
  getFilesNeedingLanguageExtension,
  getLanguageName,
  getVisibleSnippetKind,
  getTags,
  isOrderedDoc,
  KIND_FILENAMES,
  MANIFEST_FILENAME,
  parseBoard,
  parseDoc,
  parseFlashcards,
  parseTodoList,
  removeTags,
  serializeManifest,
  upperCaseFirst,
} from '@/utils';

type Props = {
  isCollapsed?: boolean;
  setIsCollapsed?: (b: boolean) => void;
  params?: Record<string, string>;
};

// TODO: refactor to extract some parts
export const CreateOrEditSnippet = ({
  isCollapsed = false,
  setIsCollapsed = () => {},
}: Props = {}) => {
  const settings = useStoreValue('settings');
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    dispatch({
      type: 'INIT',
      payload: { ...settings },
    });
  }, [settings]);

  const { navigate, params } = useRouter();

  const [errors, setErrors] = useState<z.ZodIssue[]>([]);
  const [edit, setEdit] = useState<null | SnippetSingleType>(null);
  const [missingFiles, setMissingFiles] = useState<MissingExtensionFile[] | null>(null);
  const pendingSaveRef = useRef<{
    data: z.infer<typeof SnippetSchema>;
    edit: SnippetSingleType | null;
  } | null>(null);
  useEffect(() => {
    if (params?.id) {
      (async () => {
        const snippet = await snippetService.getSnippet(params.id);

        setEdit(snippet);

        const kind = getVisibleSnippetKind(snippet.files);

        dispatch({ type: 'RESET' });
        dispatch({ type: 'SET_KIND', payload: kind });

        dispatch({ type: 'REMOVE_FILE', index: 0 });
        dispatch({ type: 'SET_DESCRIPTION', payload: removeTags(snippet?.description) });

        for (const tag of getTags(snippet.description)) {
          dispatch({ type: 'ADD_TAG', payload: tag });
        }

        for (const file in snippet?.files) {
          if (snippet.files[file].filename === MANIFEST_FILENAME) continue;

          dispatch({
            type: 'ADD_FILE',
            payload: {
              filename: snippet?.files[file].filename,
              content: snippet?.files[file].content,
              language: getLanguageName(snippet?.files[file]),
            },
          });
        }

        if (kind === 'todo') {
          dispatch({
            type: 'SET_TODOS',
            payload: parseTodoList(findTodoFile(snippet.files)?.content ?? ''),
          });
        } else if (kind === 'kanban') {
          dispatch({
            type: 'SET_BOARD',
            payload: parseBoard(findKanbanFile(snippet.files)?.content ?? ''),
          });
        } else if (kind === 'doc') {
          const ordered = isOrderedDoc(snippet.files);
          dispatch({ type: 'SET_DOC_ORDERED', payload: ordered });
          dispatch({
            type: 'SET_DOC_ENTRIES',
            payload: parseDoc(
              findDocFile(snippet.files)?.content ?? '',
              ordered ? 'ordered' : 'reference'
            ),
          });
        } else if (kind === 'flashcards') {
          dispatch({
            type: 'SET_FLASHCARDS',
            payload: parseFlashcards(findFlashcardsFile(snippet.files)?.content ?? ''),
          });
        }
      })();
    }
    return () => {
      dispatch({ type: 'RESET' });
    };
  }, [params?.id]);

  const persist = async (
    data: z.infer<typeof SnippetSchema>,
    edit: SnippetSingleType | null,
    applyLanguageExtensions: boolean
  ) => {
    const formatted = formatSnippetForSaving(data, edit, applyLanguageExtensions);

    if (edit) {
      const {
        // it is just an omit of isPublic
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        isPublic,
        ...restOfTheSnippet
      } = formatted;

      const save = await snippetService.updateSnippet({
        ...restOfTheSnippet,
        snippetId: edit.id,
      });

      if (save && save.id) {
        navigate(`/snippets/${edit.id}`);
        toast.show({ message: t('pages.new.snippetUpdated') });

        dispatch({ type: 'RESET' });
      }
    } else {
      const save = await snippetService.createSnippet(formatted);

      if (save && save.id) {
        navigate(`/snippets/${save.id}`);
        toast.show({ message: t('pages.new.snippetCreated') });

        dispatch({ type: 'RESET' });
      }
    }
  };

  const buildFormState = () => {
    const meta = getKindMeta(state.kind);

    if (!meta.filename) {
      return state;
    }

    const manifest = {
      filename: MANIFEST_FILENAME,
      content: serializeManifest(
        meta.supportsOrdering
          ? { type: state.kind, ordered: state.docOrdered }
          : { type: state.kind }
      ),
      language: 'JSON',
    };
    const kindFiles = new Set<string>([MANIFEST_FILENAME, ...Object.values(KIND_FILENAMES)]);
    const extraFiles = state.files.filter((file) => file.filename && !kindFiles.has(file.filename));
    const dataFile = {
      filename: meta.filename,
      content: kindContent(state),
      language: meta.language ?? '',
    };

    return {
      ...state,
      files: [...extraFiles, manifest, dataFile],
    };
  };

  const validateKind = () => {
    const meta = getKindMeta(state.kind);

    if (!meta.filename) return true;

    if (state.kind === 'kanban') {
      const emptyBoard = !state.board.some((column) => column.cards.some(isKanbanCard));
      if (emptyBoard) return failValidation(meta.emptyErrorKey);
    }

    if (!kindContent(state).trim()) {
      return failValidation(meta.emptyErrorKey);
    }

    return true;
  };

  const failValidation = (message: string) => {
    setErrors([
      {
        code: 'custom',
        message: t(message),
        path: ['files', 0, 'content'],
        input: undefined,
      },
    ]);
    return false;
  };

  const create = async () => {
    if (!validateKind()) return;

    const validation = SnippetSchema.safeParse(buildFormState());

    if (!validation.success) {
      setErrors(validation.error.issues);
      return;
    }

    const missing = getFilesNeedingLanguageExtension(validation.data.files);
    if (missing.length) {
      pendingSaveRef.current = { data: validation.data, edit: null };
      setMissingFiles(missing);
      return;
    }

    await persist(validation.data, null, false);
  };

  const update = async () => {
    if (!validateKind()) return;

    const validation = SnippetSchema.safeParse(buildFormState());

    if (!validation.success) {
      setErrors(validation.error.issues);
      return;
    }

    const missing = getFilesNeedingLanguageExtension(validation.data.files);
    if (missing.length) {
      pendingSaveRef.current = { data: validation.data, edit };
      setMissingFiles(missing);
      return;
    }

    await persist(validation.data, edit, false);
  };

  const resolveMissingExtensions = (apply: boolean) => {
    const pending = pendingSaveRef.current;
    pendingSaveRef.current = null;
    setMissingFiles(null);
    if (pending) {
      void persist(pending.data, pending.edit, apply);
    }
  };

  const abortMissingExtensions = () => {
    pendingSaveRef.current = null;
    setMissingFiles(null);
  };

  const meta = getKindMeta(state.kind);
  const kindLabel = t(meta.labelKey);

  return (
    <div className="h-screen w-full min-w-0 border-r border-collapse">
      <PageHeader>
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={() => setIsCollapsed(!isCollapsed)}>
              {!isCollapsed ? (
                <SidebarClose className="size-4" />
              ) : (
                <SidebarOpen className="size-4" />
              )}
            </Button>

            <div className="line-clamp-1">
              {edit
                ? `${t(`pages.new.edit${upperCaseFirst(state.kind)}`)}: ${removeTags(edit.description)}`
                : t(`pages.new.createNew${upperCaseFirst(state.kind)}`)}
            </div>
          </div>
        </div>
      </PageHeader>
      <DropZoneOverlay dispatch={dispatch} defaultLanguage={settings.newSnippetDefaultLanguage}>
        <PageContent>
          <div className="m-8 flex gap-8">
            <div
              className={
                meta.wide ? 'flex flex-col gap-4 flex-1 min-w-0' : 'flex flex-col gap-4 w-2/3'
              }
            >
              {settings.specialSnippetKinds && (
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-primary">{t('pages.new.type')}</span>
                  <Tabs
                    value={state.kind}
                    onValueChange={(value) =>
                      dispatch({ type: 'SET_KIND', payload: value as SnippetKind })
                    }
                  >
                    <TabsList className="flex h-auto flex-wrap justify-start">
                      <TabsTrigger value="snippet">{t('pages.new.typeSnippet')}</TabsTrigger>
                      {structuredKinds().map((kind) => (
                        <TabsTrigger key={kind} value={kind}>
                          {t(`pages.new.type${upperCaseFirst(kind)}`)}
                        </TabsTrigger>
                      ))}
                    </TabsList>
                  </Tabs>
                </div>
              )}
              <div className="flex justify-between gap-8">
                <div className="flex flex-col gap-2 w-full">
                  <label
                    htmlFor="description"
                    className="text-sm font-medium text-primary flex gap-2"
                  >
                    {t('pages.new.description')} <ZodError errors={errors} path={'description'} />
                  </label>
                  <div className="flex items-baseline gap-2">
                    <Textarea
                      id="description"
                      value={state.description}
                      onChange={(e) =>
                        dispatch({ type: 'SET_DESCRIPTION', payload: e.target.value })
                      }
                      placeholder={t('pages.new.enterDescription')}
                    />
                    <AiAssistantButton state={state} dispatch={dispatch} tags={state.tags} />
                  </div>
                  {edit ? null : (
                    <div className="flex items-center gap-2 mt-2">
                      <Tabs
                        value={state.isPublic ? 'true' : 'false'}
                        onValueChange={(value) =>
                          dispatch({ type: 'SET_PUBLIC', payload: value === 'true' })
                        }
                      >
                        <TabsList className="grid w-full grid-cols-2">
                          <TabsTrigger value={'true'}>
                            <Shield className="size-4 stroke-danger mr-2" /> {t('common.public')}
                          </TabsTrigger>
                          <TabsTrigger value={'false'}>
                            <ShieldCheck className="size-4 stroke-success mr-2" />{' '}
                            {t('common.private')}
                          </TabsTrigger>
                        </TabsList>
                      </Tabs>
                    </div>
                  )}
                </div>

                <div
                  className={
                    state.kind === 'kanban'
                      ? 'flex flex-col gap-2 w-64 shrink-0'
                      : 'flex flex-col gap-2 w-2/3'
                  }
                >
                  <TagsSectionLabel />
                  <TagsSection tags={state.tags} dispatch={dispatch} />
                </div>
              </div>
              <KindEditor state={state} dispatch={dispatch} errors={errors} isEdit={!!edit} />
              <div className="flex justify-between sticky bottom-0 bg-accent z-20 p-4">
                <div className="flex items-center gap-2">
                  {state.kind === 'snippet' && (
                    <>
                      <Button
                        variant="outline"
                        onClick={() =>
                          dispatch({
                            type: 'ADD_FILE',
                            payload: {
                              filename: '',
                              content: '',
                              language: settings.newSnippetDefaultLanguage,
                            },
                          })
                        }
                      >
                        <Plus className="size-4" />
                        {t('pages.new.addFile')}
                      </Button>

                      <FileUploadButton dispatch={dispatch} />
                    </>
                  )}
                </div>

                <div className="self-center">{kindCounterLabel(state)}</div>

                <div className="flex gap-2">
                  <Button
                    variant="destructive"
                    onClick={() => {
                      dispatch({ type: 'RESET' });
                      navigate('/');
                    }}
                  >
                    {upperCaseFirst(t('common.cancel'))}
                  </Button>
                  <Button
                    variant="default"
                    onClick={() => (edit ? update() : create())}
                    data-save-button
                  >
                    {edit
                      ? upperCaseFirst(t('common.update')) + ' ' + upperCaseFirst(kindLabel)
                      : `${upperCaseFirst(t('common.create'))} ${state.isPublic ? t('common.public') : t('common.private')} ${kindLabel}`}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </PageContent>
      </DropZoneOverlay>
      {missingFiles ? (
        <MissingExtensionDialog
          files={missingFiles}
          onConfirm={() => resolveMissingExtensions(true)}
          onSkip={() => resolveMissingExtensions(false)}
          onDismiss={abortMissingExtensions}
        />
      ) : null}
    </div>
  );
};
