import Editor from '@monaco-editor/react';
import { useRouter } from 'dirty-react-router';
import { Plus, SidebarClose, SidebarOpen, Info, X, Trash, Shield, ShieldCheck } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { useEffect, useReducer, useState } from 'react';
import { z } from 'zod';

import { AllTags } from '@/components/all-tags.tsx';
import { PageContent } from '@/components/layout/pages/page-content.tsx';
import { PageHeader } from '@/components/layout/pages/page-header.tsx';
import { toast } from '@/components/toast';
import { Badge } from '@/components/ui/badge.tsx';
import { Button } from '@/components/ui/button.tsx';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.tsx';
import { Input } from '@/components/ui/input.tsx';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select.tsx';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs.tsx';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip.tsx';
import { ZodError } from '@/components/zod-error.tsx';
import { EDITOR_OPTIONS } from '@/constants';
import { languageMap } from '@/constants/language-map.ts';
import { GithubAPI } from '@/lib/GithubApi.ts';
import { globalState, useStoreValue } from '@/lib/store/globalState.ts';
import { cn, formatSnippetForSaving, getEditorTheme, getTags, removeTags } from '@/lib/utils.ts';
import { GistType } from '@/types/gist.ts';

type Props = {
  isCollapsed?: boolean;
  setIsCollapsed?: (b: boolean) => void;
  params?: Record<string, string>;
};

type StateType = {
  description: string;
  isPublic: boolean;
  tags: string[];
  files: { filename: string; content: string; language: string }[];
};

const initialState: StateType = {
  description: '',
  isPublic: globalState.getState().settings.newSnippetPublicByDefault,
  tags: [],
  files: [
    {
      filename: '',
      content: '',
      language: globalState.getState().settings.newSnippetDefaultLanguage,
    },
  ],
};

type ActionType =
  | { type: 'SET_DESCRIPTION'; payload?: string }
  | { type: 'SET_PUBLIC'; payload: boolean }
  | { type: 'ADD_TAG'; payload: string }
  | { type: 'REMOVE_TAG'; payload: string }
  | { type: 'SET_FILE_LANGUAGE'; payload: string; index: number }
  | { type: 'SET_FILENAME'; payload: string; index: number }
  | { type: 'SET_CONTENT'; payload: string | null; index: number }
  | {
      type: 'ADD_FILE';
      payload?: { filename?: string; content?: string; language?: string };
    }
  | { type: 'REMOVE_FILE'; index: number }
  | { type: 'RESET' };

function reducer(state: StateType, action: ActionType) {
  switch (action.type) {
    case 'SET_DESCRIPTION':
      return { ...state, description: action.payload || '' };
    case 'SET_PUBLIC':
      return { ...state, isPublic: action.payload };
    case 'ADD_TAG':
      return {
        ...state,
        tags: [...state.tags, action.payload!].filter((tag): tag is string => tag !== undefined),
      };
    case 'REMOVE_TAG':
      return { ...state, tags: state.tags.filter((tag) => tag !== action.payload) };
    case 'SET_FILE_LANGUAGE':
      return {
        ...state,
        files: state.files.map((file, index) =>
          index === action.index ? { ...file, language: action.payload } : file
        ),
      };
    case 'SET_FILENAME':
      return {
        ...state,
        files: state.files.map((file, index) =>
          index === action.index ? { ...file, filename: action.payload } : file
        ),
      };
    case 'SET_CONTENT':
      return {
        ...state,
        files: state.files.map((file, index) =>
          index === action.index ? { ...file, content: action.payload } : file
        ),
      };
    case 'ADD_FILE':
      return {
        ...state,
        files: [
          ...state.files,
          {
            filename: action?.payload?.filename ?? '',
            content: action?.payload?.content ?? '',
            language: action?.payload?.language ?? '',
          },
        ],
      };
    case 'REMOVE_FILE':
      return {
        ...state,
        files: state.files.filter((_, index) => index !== action.index),
      };
    case 'RESET':
      return initialState;
    default:
      return state;
  }
}

const FileSchema = z.object({
  filename: z.string().min(1, 'File name is required'),
  content: z.union([z.string().min(1, 'File content is required'), z.null()]),
});

const SnippetSchema = z.object({
  description: z.string().min(1, 'Description is required'),
  isPublic: z.boolean(),
  files: z.array(FileSchema),
  tags: z.array(z.string()).optional(),
});

export const CreateOrEditSnippet = ({
  isCollapsed = false,
  setIsCollapsed = () => {},
}: Props = {}) => {
  const { navigate, params } = useRouter();
  const settings = useStoreValue('settings');

  const [state, dispatch] = useReducer(
    // TODO: check type
    // @ts-expect-error not sure why reducer it is not happy ATM
    reducer,
    initialState
  );

  const [errors, setErrors] = useState<z.ZodIssue[]>([]);
  const [edit, setEdit] = useState<null | GistType>(null);
  useEffect(() => {
    if (params?.id) {
      (async () => {
        const snippet = await GithubAPI.getGist(params.id);

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
      const save = await GithubAPI.createGist(formatSnippetForSaving(validation.data));

      if (save && save.id) {
        navigate(`/snippets/${save.id}`);
        toast.show({ message: 'Snippet created' });

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

      const save = await GithubAPI.updateGist({ ...restOfTheSnippet, gistId: edit!.id });

      if (save && save.id) {
        navigate(`/snippets/${edit!.id}`);
        toast.show({ message: 'Snippet updated' });

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
              {edit ? `Edit snippet: ${removeTags(edit.description)}` : 'Crete new snippet'}
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
                  Description <ZodError errors={errors} path={'description'} />
                </label>
                <Input
                  type="text"
                  id="description"
                  value={state.description}
                  onChange={(e) => dispatch({ type: 'SET_DESCRIPTION', payload: e.target.value })}
                  placeholder="Enter a description"
                />
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
                          <Shield className="size-4 stroke-danger mr-2" /> Public
                        </TabsTrigger>
                        <TabsTrigger value={'false'}>
                          <ShieldCheck className="size-4 stroke-success mr-2" /> Private
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
                  Tags (optional){' '}
                  <Tooltip>
                    <TooltipTrigger>
                      <Info className="size-4 stroke-gray-500" />
                    </TooltipTrigger>
                    <TooltipContent>
                      Add tags by adding{' '}
                      <code className="bg-muted-foreground dark:bg-accent rounded p-1">
                        {'#<tag>'}
                      </code>{' '}
                      to the end of description, <br />
                      or add tags by clicking on the tag on the side.
                    </TooltipContent>
                  </Tooltip>
                </label>
                <div>
                  {state.tags.length === 0 ? (
                    <motion.small
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                    >
                      Add tags to categorize your snippet
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
                        {file.content === null && <Trash />} {file.filename || 'New file'}{' '}
                        {file.content === null && <small>(Will be deleted upon update)</small>}
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
                          <Trash className="size-4" /> Remove File
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
                            File name <ZodError errors={errors} path={`files.${index}.filename`} />
                          </label>
                          <label
                            htmlFor="file-language"
                            className="w-1/2 text-sm font-medium text-primary flex gap-2"
                          >
                            File language (optional)
                          </label>
                        </div>
                        <div className="flex items-center gap-8">
                          <Input
                            type="text"
                            id="file"
                            value={file.filename}
                            onChange={(e) =>
                              dispatch({ type: 'SET_FILENAME', payload: e.target.value, index })
                            }
                            placeholder="Enter file name including extention"
                          />
                          <Select
                            onValueChange={(value) =>
                              dispatch({ type: 'SET_FILE_LANGUAGE', payload: value, index })
                            }
                            defaultValue={settings.newSnippetDefaultLanguage}
                            value={file.language ?? settings.newSnippetDefaultLanguage}
                          >
                            <SelectTrigger id="file-language">
                              <SelectValue placeholder="Select file language" />
                            </SelectTrigger>
                            <SelectContent>
                              {Object.keys(languageMap).map((language) => (
                                <SelectItem key={language} value={language}>
                                  {language}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <label
                          htmlFor="file-content"
                          className="text-sm font-medium text-primary flex gap-2"
                        >
                          File Content <ZodError errors={errors} path={`files.${index}.content`} />
                        </label>
                        <Editor
                          value={file.content}
                          onChange={(value) => {
                            dispatch({ type: 'SET_CONTENT', payload: value || '', index });
                          }}
                          className="border-primary border rounded p-1"
                          options={{
                            ...EDITOR_OPTIONS,
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
                Add another file
              </Button>

              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  onClick={() => {
                    dispatch({ type: 'RESET' });
                    navigate('/');
                  }}
                >
                  Cancel
                </Button>
                <Button variant="default" onClick={() => (edit ? update() : create())}>
                  {edit
                    ? 'Update snippet'
                    : `Create ${state.isPublic ? 'public' : 'private'} snippet`}
                </Button>
              </div>
            </div>
          </div>
          <div className="w-1/2">
            <AllTags allowCreate onClick={(tag) => dispatch({ type: 'ADD_TAG', payload: tag })} />
          </div>
        </div>
      </PageContent>
    </div>
  );
};
