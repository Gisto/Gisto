import Editor from '@monaco-editor/react';
import { useRouter } from 'dirty-react-router';
import { Plus, SidebarClose, SidebarOpen, Info, X, Trash, Shield, ShieldCheck } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { useEffect, useReducer, useState } from 'react';
import Select from 'react-dropdown-select';
import { z } from 'zod';

import { AllTags } from '@/components/all-tags.tsx';
import { AiAssistantButton } from '@/components/layout/pages/create-or-edit-snippet/ai-assistant-button.tsx';
import { initialState, reducer } from '@/components/layout/pages/create-or-edit-snippet/reducer.ts';
import { SnippetSchema } from '@/components/layout/pages/create-or-edit-snippet/schema.ts';
import { FileUploadButton } from '@/components/layout/pages/create-or-edit-snippet/upload-file-button.tsx';
import { PageContent } from '@/components/layout/pages/page-content.tsx';
import { PageHeader } from '@/components/layout/pages/page-header.tsx';
import { toast } from '@/components/toast';
import { Badge } from '@/components/ui/badge.tsx';
import { Button } from '@/components/ui/button.tsx';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.tsx';
import { Input } from '@/components/ui/input.tsx';
import { ScrollArea } from '@/components/ui/scroll-area.tsx';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs.tsx';
import { Textarea } from '@/components/ui/textarea';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip.tsx';
import { ZodError } from '@/components/zod-error.tsx';
import { EDITOR_OPTIONS } from '@/constants';
import { languageMap } from '@/constants/language-map.ts';
import { GithubApi } from '@/lib/github-api.ts';
import { t } from '@/lib/i18n';
import { useStoreValue } from '@/lib/store/globalState.ts';
import {
  cn,
  formatSnippetForSaving,
  getEditorTheme,
  getTags,
  removeTags,
  upperCaseFirst,
} from '@/lib/utils';
import { GistSingleType } from '@/types/gist.ts';

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

  // @ts-expect-error sync select types
  const customDropdownRenderer = ({ props, state, methods }) => {
    const regexp = new RegExp(state.search, 'i');

    const { options, searchBy } = props;
    const { setSearch, isSelected } = methods;

    return (
      <div className="bg-background">
        <div className="m-2">
          <Input
            type="search"
            value={state.search}
            autoFocus
            onChange={setSearch}
            placeholder={t('pages.new.findLanguage')}
          />
        </div>
        {options
          .filter((item: { [x: string]: string }) => regexp.test(item[searchBy]))
          .map(
            (option: {
              disabled: boolean;
              label: string;
              fileIndex: number;
              labelField: string;
            }) => {
              if (!props.keepSelectedInList && isSelected(option)) {
                return null;
              }

              return (
                <button
                  className={cn('block w-full text-left text-sm rounded hover:bg-primary/10 p-2')}
                  onClick={
                    option.disabled
                      ? undefined
                      : () => {
                          dispatch({
                            type: 'SET_FILE_LANGUAGE',
                            payload: option?.label,
                            index: option.fileIndex,
                          });
                        }
                  }
                >
                  {option?.label && <div>{option.label}</div>}
                </button>
              );
            }
          )}
      </div>
    );
  };

  const [errors, setErrors] = useState<z.ZodIssue[]>([]);
  const [edit, setEdit] = useState<null | GistSingleType>(null);
  useEffect(() => {
    if (params?.id) {
      (async () => {
        const snippet = await GithubApi.getGist(params.id);

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
              language: snippet?.files[file].language,
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
      setErrors(validation.error.errors);
      return;
    } else {
      const save = await GithubApi.createGist(formatSnippetForSaving(validation.data));

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
      setErrors(validation.error.errors);
      return;
    } else {
      const {
        // it is just an omit of isPublic
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        isPublic,
        ...restOfTheSnippet
      } = formatSnippetForSaving(validation.data, edit);

      const save = await GithubApi.updateGist({ ...restOfTheSnippet, gistId: edit!.id });

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
                    onChange={(e) => dispatch({ type: 'SET_DESCRIPTION', payload: e.target.value })}
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
                <label
                  htmlFor="tags"
                  className="text-sm font-medium text-primary flex items-center gap-2"
                >
                  {upperCaseFirst(t('common.tags'))} ({t('common.optional').toLowerCase()}){' '}
                  <Tooltip>
                    <TooltipTrigger>
                      <Info className="size-4 stroke-gray-500" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <span
                        dangerouslySetInnerHTML={{
                          __html: t('pages.new.addTagsTooltipHtml'),
                        }}
                      />
                    </TooltipContent>
                  </Tooltip>
                </label>
                <div className="flex items-center flex-wrap">
                  <Sheet>
                    <SheetTrigger asChild>
                      <Button variant="ghost" className="mr-2" size="sm">
                        <Plus className="size-3" />
                      </Button>
                    </SheetTrigger>
                    <SheetContent>
                      <SheetHeader>
                        <SheetTitle>{upperCaseFirst(t('common.tags'))}</SheetTitle>
                        <SheetDescription>
                          <ScrollArea className="h-[calc(100vh-100px)]">
                            <AllTags
                              allowCreate
                              onClick={(tag) => dispatch({ type: 'ADD_TAG', payload: tag })}
                            />
                          </ScrollArea>
                        </SheetDescription>
                      </SheetHeader>
                    </SheetContent>
                  </Sheet>
                  {state.tags.length === 0 ? (
                    <motion.small
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                    >
                      {t('pages.new.addTagsHelpText')}
                    </motion.small>
                  ) : (
                    <AnimatePresence>
                      {state.tags.map((tag: string) => (
                        <motion.div
                          key={tag}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          transition={{ duration: 0.3, type: 'spring' }}
                          style={{ display: 'inline-block' }}
                        >
                          <Badge className="mr-2 mb-2" variant="primary-outline">
                            {tag}{' '}
                            <X
                              className="size-3 ml-2 cursor-pointer hover:text-danger"
                              onClick={() => dispatch({ type: 'REMOVE_TAG', payload: tag })}
                            />
                          </Badge>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  )}
                </div>
              </div>
            </div>

            {state.files.map(
              (
                file: {
                  language: string | undefined;
                  filename: string | number | readonly string[] | undefined;
                  content: string | undefined;
                },
                index: number
              ) => (
                <Card key={`${index}-${file.language}`} className="hover:border-primary">
                  <CardHeader>
                    <CardTitle className="flex justify-between items-center">
                      <div
                        className={cn(
                          'flex items-center gap-2',
                          file.content === null && 'text-danger'
                        )}
                      >
                        {file.content === null && <Trash />}{' '}
                        {file.filename || t('pages.new.newFile')}{' '}
                        {file.content === null && (
                          <small>({t('pages.new.willBeDeletedUponUpdate')})</small>
                        )}
                      </div>
                      {state.files.length > 1 && file.content !== null && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            if (edit) {
                              dispatch({ type: 'SET_CONTENT', payload: null, index });
                            } else {
                              dispatch({ type: 'REMOVE_FILE', index });
                            }
                          }}
                        >
                          <Trash className="size-4" /> {t('pages.new.removeFile')}
                        </Button>
                      )}
                    </CardTitle>
                  </CardHeader>
                  {file.content !== null && (
                    <CardContent>
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-8">
                          <label
                            htmlFor="file"
                            className="w-1/2 text-sm font-medium text-primary flex gap-2"
                          >
                            {upperCaseFirst(t('common.file'))}{' '}
                            <ZodError errors={errors} path={`files.${index}.filename`} />
                          </label>
                          <label
                            htmlFor="file-language"
                            className="w-1/2 text-sm font-medium text-primary flex gap-2"
                          >
                            {t('pages.new.fileSyntax')} ({t('common.optional').toLowerCase()})
                          </label>
                        </div>
                        <div className="flex items-center gap-6">
                          <Input
                            type="text"
                            id="file"
                            value={file.filename}
                            onChange={(e) =>
                              dispatch({ type: 'SET_FILENAME', payload: e.target.value, index })
                            }
                            placeholder={t('pages.new.enterFileName')}
                          />
                          <div className="w-full">
                            <Select
                              options={[
                                ...Object.keys(languageMap).map((language) => ({
                                  label: language,
                                  value: languageMap[language],
                                  fileIndex: index,
                                })),
                              ]}
                              onChange={(val) =>
                                dispatch({
                                  type: 'SET_FILE_LANGUAGE',
                                  // @ts-expect-error TODO need to sync types
                                  payload: val.value,
                                  index,
                                })
                              }
                              color="hsl(var(--primary))"
                              contentRenderer={({ state }) => (
                                <div className="text-sm">
                                  {state.values && state.values[0]?.label && state.values[0].label}
                                </div>
                              )}
                              dropdownRenderer={customDropdownRenderer}
                              values={
                                [
                                  {
                                    label: file.language
                                      ? file.language
                                      : settings.newSnippetDefaultLanguage,
                                    value: file.language
                                      ? languageMap[file.language]
                                      : settings.newSnippetDefaultLanguage,
                                  },
                                ] as { label: string; value: string; fileIndex?: number }[]
                              }
                            />
                          </div>
                        </div>

                        <label
                          htmlFor="file-content"
                          className="text-sm font-medium text-primary flex gap-2"
                        >
                          {t('pages.new.fileContent')}{' '}
                          <ZodError errors={errors} path={`files.${index}.content`} />
                        </label>
                        <Editor
                          value={file.content}
                          onChange={(value) => {
                            dispatch({ type: 'SET_CONTENT', payload: value || '', index });
                          }}
                          className="border-primary border rounded p-1"
                          options={{
                            ...EDITOR_OPTIONS,
                            ...settings.editor,
                            readOnly: false,
                            codeLens: false,
                          }}
                          height="30vh"
                          theme={getEditorTheme()}
                          language={
                            languageMap[file?.language ?? settings.newSnippetDefaultLanguage]
                          }
                        />
                      </div>
                    </CardContent>
                  )}
                </Card>
              )
            )}

            <div className="flex justify-between">
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

              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  onClick={() => {
                    dispatch({ type: 'RESET' });
                    navigate('/');
                  }}
                >
                  {upperCaseFirst(t('common.cancel'))}
                </Button>
                <Button variant="default" onClick={() => (edit ? update() : create())}>
                  {edit
                    ? upperCaseFirst(t('common.update')) + ' ' + upperCaseFirst(t('common.snippet'))
                    : `${upperCaseFirst(t('common.create'))} ${state.isPublic ? t('common.public') : t('common.private')} ${t('common.snippet')}`}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </PageContent>
    </div>
  );
};
