import { useRouter } from 'dirty-react-router';
import { Plus, SidebarClose, SidebarOpen, Shield, ShieldCheck } from 'lucide-react';
import { useEffect, useReducer, useState } from 'react';
import { z } from 'zod';

import { AiAssistantButton } from '@/components/layout/pages/create-or-edit-snippet/ai-assistant-button.tsx';
import { DropZoneOverlay } from '@/components/layout/pages/create-or-edit-snippet/drop-zone-overlay.tsx';
import { FileCard } from '@/components/layout/pages/create-or-edit-snippet/file-card.tsx';
import { initialState, reducer } from '@/components/layout/pages/create-or-edit-snippet/reducer.ts';
import { SnippetSchema } from '@/components/layout/pages/create-or-edit-snippet/schema.ts';
import {
  TagsSection,
  TagsSectionLabel,
} from '@/components/layout/pages/create-or-edit-snippet/tags-section.tsx';
import { FileUploadButton } from '@/components/layout/pages/create-or-edit-snippet/upload-file-button.tsx';
import { PageContent } from '@/components/layout/pages/page-content.tsx';
import { PageHeader } from '@/components/layout/pages/page-header.tsx';
import { toast } from '@/components/toast';
import { Button } from '@/components/ui/button.tsx';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs.tsx';
import { Textarea } from '@/components/ui/textarea';
import { ZodError } from '@/components/zod-error.tsx';
import { t } from '@/lib/i18n';
import { snippetService } from '@/lib/providers/snippet-service.ts';
import { useStoreValue } from '@/lib/store/globalState.ts';
import { SnippetSingleType } from '@/types/snippet.ts';
import {
  formatSnippetForSaving,
  getLanguageName,
  getTags,
  removeTags,
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
  const [state, dispatch] = useReducer(reducer, initialState);
  const { navigate, params } = useRouter();
  const settings = useStoreValue('settings');

  const [errors, setErrors] = useState<z.ZodIssue[]>([]);
  const [edit, setEdit] = useState<null | SnippetSingleType>(null);
  useEffect(() => {
    if (params?.id) {
      (async () => {
        const snippet = await snippetService.getSnippet(params.id);

        setEdit(snippet);

        dispatch({ type: 'RESET' });

        dispatch({ type: 'REMOVE_FILE', index: 0 });
        dispatch({ type: 'SET_DESCRIPTION', payload: removeTags(snippet?.description) });

        for (const tag of getTags(snippet.description)) {
          dispatch({ type: 'ADD_TAG', payload: tag });
        }

        for (const file in snippet?.files) {
          dispatch({
            type: 'ADD_FILE',
            payload: {
              filename: snippet?.files[file].filename,
              content: snippet?.files[file].content,
              language: getLanguageName(snippet?.files[file]),
            },
          });
        }
      })();
    }
    return () => {
      dispatch({ type: 'RESET' });
    };
  }, [params?.id]);

  const create = async () => {
    const validation = SnippetSchema.safeParse(state);

    if (!validation.success) {
      setErrors(validation.error.issues);
      return;
    } else {
      const save = await snippetService.createSnippet(formatSnippetForSaving(validation.data));

      if (save && save.id) {
        navigate(`/snippets/${save.id}`);
        toast.show({ message: t('pages.new.snippetCreated') });

        dispatch({ type: 'RESET' });
      }
    }
  };

  const update = async () => {
    const validation = SnippetSchema.safeParse(state);

    if (!validation.success) {
      setErrors(validation.error.issues);
      return;
    } else {
      const {
        // it is just an omit of isPublic
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        isPublic,
        ...restOfTheSnippet
      } = formatSnippetForSaving(validation.data, edit);

      const save = await snippetService.updateSnippet({
        ...restOfTheSnippet,
        snippetId: edit!.id,
      });

      if (save && save.id) {
        navigate(`/snippets/${edit!.id}`);
        toast.show({ message: t('pages.new.snippetUpdated') });

        dispatch({ type: 'RESET' });
      }
    }
  };

  return (
    <div className="h-screen w-full border-r border-collapse">
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
                ? `${t('pages.new.editSnippet')}: ${removeTags(edit.description)}`
                : t('pages.new.createNewSnippet')}
            </div>
          </div>
        </div>
      </PageHeader>
      <DropZoneOverlay dispatch={dispatch} defaultLanguage={settings.newSnippetDefaultLanguage}>
        <PageContent>
          <div className="m-8 flex gap-8">
            <div className="flex flex-col gap-4 w-2/3">
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
                      className="bg-white"
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

                <div className="flex flex-col gap-2 w-2/3">
                  <TagsSectionLabel />
                  <TagsSection tags={state.tags} dispatch={dispatch} />
                </div>
              </div>
              <div className="text-xs">{t('pages.new.dragDropTip')}</div>
              {state.files.map(
                (
                  file: {
                    language: string | undefined;
                    filename: string | number | readonly string[] | undefined;
                    content: string | undefined;
                  },
                  index: number
                ) => (
                  <FileCard
                    key={`${index}-${file.language}`}
                    file={file}
                    index={index}
                    dispatch={dispatch}
                    isEdit={!!edit}
                    errors={errors}
                    totalFiles={state.files.length}
                  />
                )
              )}
              <div className="flex justify-between sticky bottom-0 bg-accent z-20 p-4">
                <div className="flex items-center gap-2">
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
                </div>

                <div className="self-center">Editing {state.files.length} files</div>

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
                  <Button variant="default" onClick={() => (edit ? update() : create())}>
                    {edit
                      ? upperCaseFirst(t('common.update')) +
                        ' ' +
                        upperCaseFirst(t('common.snippet'))
                      : `${upperCaseFirst(t('common.create'))} ${state.isPublic ? t('common.public') : t('common.private')} ${t('common.snippet')}`}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </PageContent>
      </DropZoneOverlay>
    </div>
  );
};
