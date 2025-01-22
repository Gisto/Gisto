import Editor from '@monaco-editor/react';
import { FileCode, MoreVertical, ChevronsDownUp, ChevronsUpDown, Eye } from 'lucide-react';
import { useRef, useState } from 'react';

import { useTheme } from '@/components/theme/theme-provider.tsx';
import { Button } from '@/components/ui/button.tsx';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu.tsx';
import { EDITOR_OPTIONS } from '@/constants';
import { languageMap } from '@/constants/language-map.ts';
import { useStoreValue } from '@/lib/store/globalState.ts';
import { copyToClipboard } from '@/lib/utils.ts';
import { GistFileType, GistType } from '@/types/gist.ts';

export const SnippetFile = ({ file, snippet }: { file: GistFileType; snippet: GistType }) => {
  const settings = useStoreValue('settings');
  const [height, setHeight] = useState('65vh');
  const [collapsed, setCollapsed] = useState(settings.filesCollapsedByDefault);
  const { theme } = useTheme();
  const editorRef = useRef(null);

  // @ts-expect-error 3rd party types
  function handleEditorDidMount(editor) {
    editorRef.current = editor;
    const originalLineCount = editor.getContentHeight() || 0;

    setHeight(originalLineCount > 500 ? '65vh' : originalLineCount);
  }

  return (
    <div>
      <div className="flex items-center gap-2 justify-between bg-background py-2 px-4 border-b text-lg">
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreVertical className="h-4 w-4" />
                <span className="sr-only">More</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuItem asChild>
                <a
                  className="cursor-pointer"
                  href={`${snippet.html_url}#file-${file.filename
                    .replace(/\\|-|\./g, '-')
                    .replace(/--/g, '-')
                    .toLowerCase()}`}
                  target="_blank"
                >
                  Open on web
                </a>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => copyToClipboard(file.content)}>
                Copy file contents to clipboard
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <a
                  className="cursor-pointer"
                  href={`https://carbon.now.sh/${snippet.id}?filename=${file.filename}`}
                  target="_blank"
                >
                  Open in carbon.now.sh
                </a>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <FileCode className="size-4" />

          {file.filename}
        </div>
        <div className="flex items-center gap-2">
          <Button disabled variant="ghost" size="icon" onClick={() => null}>
            <Eye className="size-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => setCollapsed(!collapsed)}>
            {collapsed ? (
              <ChevronsUpDown className="size-4" />
            ) : (
              <ChevronsDownUp className="size-4" />
            )}
          </Button>
        </div>
      </div>
      {collapsed ? (
        <div className="mb-4" />
      ) : (
        <div className="bg-background py-2 px-4 overflow-auto mb-4 font-mono">
          {file.truncated ? (
            <div className="p-4">
              File too large, please{' '}
              <a
                className="underline hover:underline-offset-2"
                target="_blank"
                href={`${snippet.html_url}#file-${file.filename
                  .replace(/\\|-|\./g, '-')
                  .replace(/--/g, '-')
                  .toLowerCase()}`}
              >
                open on web
              </a>
            </div>
          ) : (
            <Editor
              options={{
                ...EDITOR_OPTIONS,
                ...settings.editor,
              }}
              onMount={handleEditorDidMount}
              height={height}
              theme={theme === 'dark' ? 'vs-dark' : 'light'}
              defaultLanguage={languageMap[file.language || file.filename.split('.')[1]] ?? 'text'}
              defaultValue={file.content}
            />
          )}
        </div>
      )}
    </div>
  );
};
