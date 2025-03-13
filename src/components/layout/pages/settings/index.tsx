import MonacoEditor from '@monaco-editor/react';
import { SidebarClose, SidebarOpen } from 'lucide-react';

import { PageContent } from '@/components/layout/pages/page-content.tsx';
import { PageHeader } from '@/components/layout/pages/page-header.tsx';
import { DynamicSettings } from '@/components/layout/pages/settings/dynamic-settings.tsx';
import { Button } from '@/components/ui/button.tsx';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { EDITOR_OPTIONS } from '@/constants';
import { updateSettings, useStoreValue } from '@/lib/store/globalState.ts';
import { getEditorTheme } from '@/lib/utils';

type Props = {
  isCollapsed?: boolean;
  setIsCollapsed?: (b: boolean) => void;
  params?: Record<string, string>;
};

export const Settings = ({ isCollapsed = false, setIsCollapsed = () => {} }: Props = {}) => {
  const settings = useStoreValue('settings');

  const handleChange = (key: string, value: unknown) =>
    updateSettings({
      [key]: value,
    });

  const { editor, ...restOfTheSettings } = settings;

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

            <div className="line-clamp-1">Settings</div>
          </div>
        </div>
      </PageHeader>

      <PageContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Settings</CardTitle>
              <CardDescription>Main application settings</CardDescription>
            </CardHeader>
            <CardContent>
              <DynamicSettings settings={{ ...restOfTheSettings }} onChange={handleChange} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Editor</CardTitle>
              <CardDescription>Editor specific settings</CardDescription>
            </CardHeader>
            <CardContent>
              <DynamicSettings settings={{ ...editor }} path="editor" onChange={handleChange} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Preview</CardTitle>
              <CardDescription>Basic editor settings preview</CardDescription>
            </CardHeader>
            <CardContent>
              <MonacoEditor
                options={{
                  ...EDITOR_OPTIONS,
                  ...settings.editor,
                  readOnly: false,
                }}
                height="300px"
                theme={getEditorTheme()}
                defaultLanguage={'javascript'}
                defaultValue={`function createObject(name, age) {
  return { name, age };
}`}
              />
            </CardContent>
          </Card>
        </div>
      </PageContent>
    </div>
  );
};
