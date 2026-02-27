import MonacoEditor from '@monaco-editor/react';
import { HelpCircle, SidebarClose, SidebarOpen, Download, Upload } from 'lucide-react';
import { useState, useRef } from 'react';

import { PageContent } from '@/components/layout/pages/page-content.tsx';
import { PageHeader } from '@/components/layout/pages/page-header.tsx';
import { DynamicSettings } from '@/components/layout/pages/settings/dynamic-settings.tsx';
import { SimpleTooltip } from '@/components/simple-tooltip.tsx';
import { Button } from '@/components/ui/button.tsx';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { InputPassword } from '@/components/ui/inputPassword.tsx';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { EDITOR_OPTIONS } from '@/constants';
import { generateAiResponse, AiApiError } from '@/lib/api/ai-api.ts';
import { exportLocalDatabase, importLocalDatabase } from '@/lib/api/local-api.ts';
import { t } from '@/lib/i18n';
import { updateSettings, useStoreValue } from '@/lib/store/globalState.ts';
import { getEditorTheme } from '@/utils';

type Props = {
  isCollapsed?: boolean;
  setIsCollapsed?: (b: boolean) => void;
  params?: Record<string, string>;
};

export const Settings = ({ isCollapsed = false, setIsCollapsed = () => {} }: Props = {}) => {
  const settings = useStoreValue('settings');
  const [testPrompt, setTestPrompt] = useState('');
  const [testResponse, setTestResponse] = useState('');
  const [isTesting, setIsTesting] = useState(false);
  const [, setTick] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const forceUpdate = () => setTick((tick) => tick + 1);

  const handleChange = (key: string, value: unknown) =>
    updateSettings({
      [key]: value,
    });

  const handleExport = async () => {
    try {
      const blob = await exportLocalDatabase();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `gisto-backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Export failed:', error);
    }
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      await importLocalDatabase(file);
      forceUpdate();
    } catch (error) {
      console.error('Import failed:', error);
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleTestPrompt = async () => {
    if (!testPrompt.trim()) return;

    setIsTesting(true);
    setTestResponse('');
    try {
      const response = await generateAiResponse({
        prompt: testPrompt,
      });
      setTestResponse(response);
    } catch (error) {
      if (error instanceof AiApiError) {
        const modelInfo = ai.model ? `\n\nModel: ${ai.model}` : '';
        const providerInfo =
          error.provider === 'openrouter'
            ? '\n\nTip: If using a free model, it may be unavailable or have rate limits. Try a different model or check openrouter.ai/models for current availability.'
            : '';
        setTestResponse(`Error: ${error.message}${modelInfo}${providerInfo}`);
      } else {
        setTestResponse(
          `Error: ${error instanceof Error ? error.message : 'An unexpected error occurred'}`
        );
      }
    } finally {
      setIsTesting(false);
    }
  };

  const {
    editor,
    ai,
    theme,
    language,
    activeSnippetProvider,
    newSnippetDefaultLanguage,
    sidebarCollapsedByDefault,
    filesCollapsedByDefault,
    newSnippetPublicByDefault,
    jsonPreviewCollapsedByDefault,
    filesPreviewEnabledByDefault,
    sortFilesByMarkdownFirst,
    dashboardSnippetsOverTimeRange,
  } = settings;

  // Group settings into logical sections
  const appearanceSettings = {
    theme,
    language,
    dashboardSnippetsOverTimeRange,
  };

  const snippetSettings = {
    newSnippetDefaultLanguage,
    sidebarCollapsedByDefault,
    filesCollapsedByDefault,
    newSnippetPublicByDefault,
    jsonPreviewCollapsedByDefault,
    filesPreviewEnabledByDefault,
    sortFilesByMarkdownFirst,
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

            <div className="line-clamp-1">{t('pages.settings.title')}</div>
          </div>
        </div>
      </PageHeader>

      <PageContent>
        <Tabs defaultValue="general" className="w-full">
          <TabsList variant="line" className="w-full">
            <TabsTrigger value="general">{t('pages.settings.general')}</TabsTrigger>
            <TabsTrigger value="editor">{t('pages.settings.editor')}</TabsTrigger>
            <TabsTrigger value="ai">{t('pages.settings.aiAssistant')}</TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Gisto settings</CardTitle>
                  <CardDescription>Theme, language, and access tokens.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <DynamicSettings
                    settings={appearanceSettings as Record<string, unknown>}
                    onChange={handleChange}
                  />
                  <div className="mb-4">
                    <label className="text-sm font-medium block mb-1">
                      {t('pages.settings.snippetProvider')}
                    </label>
                    <div className="text-sm py-2 px-3 bg-muted rounded-md">
                      {activeSnippetProvider === 'github'
                        ? 'GitHub'
                        : activeSnippetProvider === 'gitlab'
                          ? 'GitLab'
                          : 'Local'}
                    </div>
                  </div>
                  {activeSnippetProvider === 'github' && (
                    <div className="flex flex-col space-y-1.5">
                      <label className="text-sm font-medium">{t('login.githubToken')}</label>
                      <InputPassword
                        value={localStorage.getItem('GITHUB_TOKEN') || ''}
                        onChange={(e) => {
                          localStorage.setItem('GITHUB_TOKEN', e.target.value);
                          forceUpdate();
                        }}
                        placeholder={t('login.enterGithubToken')}
                      />
                    </div>
                  )}
                  {activeSnippetProvider === 'gitlab' && (
                    <div className="flex flex-col space-y-1.5">
                      <label className="text-sm font-medium">{t('login.gitlabToken')}</label>
                      <InputPassword
                        value={localStorage.getItem('GITLAB_TOKEN') || ''}
                        onChange={(e) => {
                          localStorage.setItem('GITLAB_TOKEN', e.target.value);
                          forceUpdate();
                        }}
                        placeholder={t('login.enterGitlabToken')}
                      />
                    </div>
                  )}
                  {activeSnippetProvider === 'local' && (
                    <div className="flex flex-col space-y-3 pt-4 border-t">
                      <label className="text-sm font-medium">
                        {t('pages.settings.localDatabase')}
                      </label>
                      <div className="flex gap-2">
                        <Button variant="outline" onClick={handleExport} className="flex-1">
                          <Download className="size-4 mr-2" />
                          {t('pages.settings.export')}
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => fileInputRef.current?.click()}
                          className="flex-1"
                        >
                          <Upload className="size-4 mr-2" />
                          {t('pages.settings.import')}
                        </Button>
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept=".json"
                          onChange={handleImport}
                          className="hidden"
                        />
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {t('pages.settings.localDatabaseDescription')}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>{t('pages.settings.snippets')}</CardTitle>
                  <CardDescription>
                    {t('pages.settings.defaultBehaviorForNewSnippets')}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <DynamicSettings
                    settings={snippetSettings as Record<string, unknown>}
                    onChange={handleChange}
                  />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="editor" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>{t('pages.settings.editor')}</CardTitle>
                  <CardDescription>{t('pages.settings.editorSpecificSettings')}</CardDescription>
                </CardHeader>
                <CardContent>
                  <DynamicSettings settings={{ ...editor }} path="editor" onChange={handleChange} />
                </CardContent>
              </Card>

              <Card className="lg:sticky lg:top-4 self-start">
                <CardHeader>
                  <CardTitle>{t('pages.settings.preview')}</CardTitle>
                  <CardDescription>
                    {t('pages.settings.basicEditorSettingsPreview')}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <MonacoEditor
                    options={{
                      ...EDITOR_OPTIONS,
                      ...settings.editor,
                      readOnly: false,
                    }}
                    height="400px"
                    theme={getEditorTheme()}
                    defaultLanguage={'javascript'}
                    defaultValue={`type Note = { id: string; title: string; tags?: string[] };

const normalizeTags = (tags: string[] = []) =>
  Array.from(new Set(tags.map((t) => t.trim().toLowerCase()))).filter(Boolean);

function createNote(title: string, tags?: string[]): Note {
  return {
    id: crypto.randomUUID(),
    title: title.trim(),
    tags: normalizeTags(tags),
  };
}

console.log(createNote('Gisto Settings', ['UI', 'ui', ' Editor ']));`}
                  />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="ai" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>{t('pages.settings.aiAssistant')}</CardTitle>
                  <CardDescription>{t('pages.settings.configureAiModels')}</CardDescription>
                </CardHeader>
                <CardContent>
                  <DynamicSettings
                    settings={{ ...ai } as Record<string, unknown>}
                    path="ai"
                    onChange={handleChange}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <CardTitle>{t('pages.settings.promptAssistant')}</CardTitle>
                    <SimpleTooltip
                      className="max-w-md"
                      content={
                        <div className="space-y-2 text-primary-foreground">
                          <p>Interact with AI using your configured model and settings.</p>
                          <p className="font-semibold mt-2">Example:</p>
                          <pre className="text-xs bg-primary-foreground/20 p-2 rounded overflow-x-auto">
                            {`Explain what this code does:
function createObject(name, age) {
  return { name, age };
}`}
                          </pre>
                          <p className="text-xs opacity-90 mt-2">
                            Current: {ai.model || 'Not configured'} (temp: {ai.temperature ?? 0.7})
                          </p>
                        </div>
                      }
                    >
                      <HelpCircle className="size-4 text-muted-foreground cursor-help" />
                    </SimpleTooltip>
                  </div>
                  <CardDescription>{t('pages.settings.interactWithAiDirectly')}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">{t('pages.settings.yourPrompt')}</label>
                    <Textarea
                      placeholder="e.g. Explain what this code does: console.log('Hello, world!');"
                      value={testPrompt}
                      onChange={(e) => setTestPrompt(e.target.value)}
                      className="min-h-[150px] font-mono text-sm"
                    />
                    <Button
                      onClick={handleTestPrompt}
                      disabled={isTesting || !testPrompt.trim()}
                      className="w-full"
                    >
                      {isTesting ? t('pages.settings.sending') : t('pages.settings.sendPrompt')}
                    </Button>
                  </div>

                  {testResponse && (
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Response</label>
                      <div className="rounded-md bg-muted p-3 border min-h-[150px]">
                        <pre className="text-sm whitespace-pre-wrap break-words font-mono">
                          {testResponse}
                        </pre>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </PageContent>
    </div>
  );
};
