import { Plus, SidebarClose, SidebarOpen } from 'lucide-react';
import Editor from '@monaco-editor/react';
import { PageHeader } from '@/components/layout/page-header.tsx';
import { Button } from '@/components/ui/button.tsx';
import { Input } from '@/components/ui/input.tsx';
import { useTheme } from '@/components/layout/theme-provider.tsx';
import { EDITOR_OPTIONS } from '@/constants';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card.tsx';
import React from 'react';

type Props = {
  isCollapsed?: boolean;
  setIsCollapsed?: (b: boolean) => void;
  params?: Record<string, string>;
};

export const CreateNew = ({ isCollapsed = false, setIsCollapsed = () => {} }: Props = {}) => {
  const { theme } = useTheme();

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

      <div className="m-8">
        <div className="flex flex-col gap-4 w-2/3">
          <div className="flex flex-col gap-2">
            <label htmlFor="description" className="text-sm font-medium text-primary">
              Description
            </label>
            <Input
              type="text"
              id="description"
              name="description"
              placeholder="Enter a description"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="tags" className="text-sm font-medium text-primary">
              Tags
            </label>
            <Input type="text" id="tags" name="tags" placeholder="Enter comma seperated tags" />
          </div>

          <Card>
            <CardHeader>
              <CardTitle>New file</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-2">
                <label htmlFor="file" className="text-sm font-medium text-primary">
                  File name
                </label>
                <Input
                  type="text"
                  id="file"
                  name="filename"
                  placeholder="Enter file name including extention"
                />

                <label htmlFor="file-content" className="text-sm font-medium text-primary">
                  File Content
                </label>
                <Editor
                  className="border-primary border rounded p-1  "
                  options={{
                    ...EDITOR_OPTIONS,
                    readOnly: false,
                    codeLens: false,
                  }}
                  // onMount={handleEditorDidMount}
                  height={300}
                  theme={theme === 'dark' ? 'vs-dark' : 'light'}
                  // defaultLanguage={languageMap[file.language || file.filename.split('.')[1]] ?? 'text'}
                  // defaultValue={file.content}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline">
                <Plus className="size-4" />
                Add another file
              </Button>
            </CardFooter>
          </Card>

          <div className="flex justify-end gap-2">
            <Button variant="ghost">Cancel</Button>
            <Button variant="default">Create</Button>
          </div>
        </div>
      </div>
    </div>
  );
};
