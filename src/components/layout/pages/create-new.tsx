import Editor from '@monaco-editor/react';
import { useRouter } from 'dirty-react-router';
import { Plus, SidebarClose, SidebarOpen, Info, X, Trash, Shield, ShieldCheck } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { useReducer, useState } from 'react';
import { z } from 'zod';

import { AllTags } from '@/components/all-tags.tsx';
import { PageHeader } from '@/components/layout/pages/page-header.tsx';
import { useTheme } from '@/components/theme/theme-provider.tsx';
import { toast } from '@/components/toast/toast-manager.tsx';
import { Badge } from '@/components/ui/badge.tsx';
import { Button } from '@/components/ui/button.tsx';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.tsx';
import { Input } from '@/components/ui/input.tsx';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs.tsx';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip.tsx';
import { ZodError } from '@/components/zod-error.tsx';
import { EDITOR_OPTIONS } from '@/constants';
import { GithubAPI } from '@/lib/GithubApi.ts';
import { formatSnippetForSaving } from '@/lib/utils.ts';

type Props = {
  isCollapsed?: boolean;
  setIsCollapsed?: (b: boolean) => void;
  params?: Record<string, string>;
};

type StateType = {
  description: string;
  isPublic: boolean;
  tags: string[];
  files: { filename: string; content: string }[];
};

const initialState: StateType = {
  description: '',
  isPublic: true,
  tags: [],
  files: [{ filename: '', content: '' }],
};

type ActionType =
  | { type: 'SET_DESCRIPTION'; payload?: string }
  | { type: 'SET_PUBLIC'; payload: boolean }
  | { type: 'ADD_TAG'; payload: string }
  | { type: 'REMOVE_TAG'; payload: string }
  | { type: 'SET_FILENAME'; payload: string; index: number }
  | { type: 'SET_CONTENT'; payload: string; index: number }
  | { type: 'ADD_FILE' }
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
        files: [...state.files, { filename: '', content: '' }],
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
  content: z.string().min(1, 'File content is required'),
});

const SnippetSchema = z.object({
  description: z.string().min(1, 'Description is required'),
  isPublic: z.boolean(),
  files: z.array(FileSchema),
  tags: z.array(z.string()).optional(),
});

export const CreateNew = ({ isCollapsed = false, setIsCollapsed = () => {} }: Props = {}) => {
  const { theme } = useTheme();
  const [state, dispatch] = useReducer(reducer, initialState);
  const [errors, setErrors] = useState<z.ZodIssue[]>([]);
  const { navigate } = useRouter();

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

  return (
    <div className="h-screen w-full border-r border-collapse overflow-auto">
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

            <div className="line-clamp-1">Crete new snippet</div>
          </div>
        </div>
      </PageHeader>

      <div className="m-8 flex gap-8">
        <div className="flex flex-col gap-4 w-2/3">
          <div className="flex justify-between gap-8">
            <div className="flex flex-col gap-2 w-full">
              <label htmlFor="description" className="text-sm font-medium text-primary flex gap-2">
                Description <ZodError errors={errors} path={'description'} />
              </label>
              <Input
                type="text"
                id="description"
                value={state.description}
                onChange={(e) => dispatch({ type: 'SET_DESCRIPTION', payload: e.target.value })}
                placeholder="Enter a description"
              />
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
                filename: string | number | readonly string[] | undefined;
                content: string | undefined;
              },
              index: number
            ) => (
              <Card className="hover:border-primary">
                <CardHeader>
                  <CardTitle className="flex justify-between items-center">
                    {file.filename || 'New file'}
                    {state.files.length > 1 && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => dispatch({ type: 'REMOVE_FILE', index })}
                      >
                        <Trash className="size-4" /> Remove File
                      </Button>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col gap-2">
                    <label htmlFor="file" className="text-sm font-medium text-primary flex gap-2">
                      File name <ZodError errors={errors} path={`files.${index}.filename`} />
                    </label>
                    <Input
                      type="text"
                      id="file"
                      value={file.filename}
                      onChange={(e) =>
                        dispatch({ type: 'SET_FILENAME', payload: e.target.value, index })
                      }
                      placeholder="Enter file name including extention"
                    />

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
                      className="border-primary border rounded p-1  "
                      options={{
                        ...EDITOR_OPTIONS,
                        readOnly: false,
                        codeLens: false,
                      }}
                      height="32vh"
                      theme={theme === 'dark' ? 'vs-dark' : 'light'}
                      // defaultLanguage={languageMap[file.language || file.filename.split('.')[1]] ?? 'text'}
                      // defaultValue={file.content}
                    />
                  </div>
                </CardContent>
              </Card>
            )
          )}

          <div className="flex justify-between">
            <Button variant="outline" onClick={() => dispatch({ type: 'ADD_FILE' })}>
              <Plus className="size-4" />
              Add another file
            </Button>

            <div className="flex gap-2">
              <Button variant="ghost">Cancel</Button>
              <Button variant="default" onClick={() => create()}>
                Create {state.isPublic ? 'public' : 'private'} snippet
              </Button>
            </div>
          </div>
        </div>
        <div className="w-1/2">
          <AllTags allowCreate onClick={(tag) => dispatch({ type: 'ADD_TAG', payload: tag })} />
        </div>
      </div>
    </div>
  );
};
