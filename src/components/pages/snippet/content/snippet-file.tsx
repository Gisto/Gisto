import { FileCode, MoreVertical } from 'lucide-react';

import Editor from '@monaco-editor/react';

import { useRef, useState } from 'react';

import { GistFileType, GistType } from '@/types/gist.ts';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu.tsx';
import { Button } from '@/components/ui/button.tsx';
import { useTheme } from '@/components/layout/theme-provider.tsx';
import { languageMap } from '@/constants/language-map.ts';
import { copyToClipboard } from '@/lib/utils.ts';

export const SnippetFile = ({ file, snippet }: { file: GistFileType; snippet: GistType }) => {
  const [height, setHeight] = useState('65vh');
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
              <DropdownMenuItem
                onClick={() => {
                  window.open(
                    `${snippet.html_url}#file-${file.filename
                      .replace(/\\|-|\./g, '-')
                      .replace(/--/g, '-')
                      .toLowerCase()}`
                  );
                }}
              >
                Open on web
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => copyToClipboard(file.content)}>
                Copy file contents to clipboard
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() =>
                  window.open(`https://carbon.now.sh/${snippet.id}?filename=${file.filename}`)
                }
              >
                Open in carbon.now.sh
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <FileCode className="size-4" />

          {file.filename}
        </div>
      </div>
      <div className="bg-background py-2 px-4 overflow-auto mb-8">
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
              scrollBeyondLastLine: false,
              readOnly: true,
              automaticLayout: true,
            }}
            onMount={handleEditorDidMount}
            height={height}
            theme={theme === 'dark' ? 'vs-dark' : 'light'}
            defaultLanguage={languageMap[file.language || file.filename.split('.')[1]] ?? 'text'}
            defaultValue={file.content}
          />
        )}
      </div>
    </div>
  );
};
