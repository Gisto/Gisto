import MonacoEditor from '@monaco-editor/react';
import { SidebarClose, SidebarOpen, Download, Upload, Sparkles } from 'lucide-react';
import { useState, useRef, useCallback } from 'react';

import type { AssistantMessage } from '@/components/prompt-assistant.tsx';
import type { ChatMessage } from '@/lib/api/ai-api.ts';

import { AIChatDialog } from '@/components/ai-chat-dialog.tsx';
import { PageContent } from '@/components/layout/pages/page-content.tsx';
import { PageHeader } from '@/components/layout/pages/page-header.tsx';
import { DynamicSettings } from '@/components/layout/pages/settings/dynamic-settings.tsx';
import { Button } from '@/components/ui/button.tsx';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input.tsx';
import { InputPassword } from '@/components/ui/inputPassword.tsx';
import { Separator } from '@/components/ui/separator.tsx';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { EDITOR_OPTIONS } from '@/constants';
import { GISTO_APP_CONTEXT } from '@/constants/ai-context';
import { getProviderConfig, getTranslation, SnippetProviderType } from '@/constants/providers.tsx';
import { generateAiResponse, AiApiError, isAiAvailable } from '@/lib/api/ai-api.ts';
import { exportLocalDatabase, importLocalDatabase } from '@/lib/api/local-api.ts';
import { t } from '@/lib/i18n';
import { updateSettings, useStoreValue, defaultSettings } from '@/lib/store/globalState.ts';
import { getEditorTheme } from '@/utils';
import { defineEditorThemes } from '@/utils/monacoTheme';

type Props = {
  isCollapsed?: boolean;
  setIsCollapsed?: (b: boolean) => void;
  params?: Record<string, string>;
};

export const Settings = ({ isCollapsed = false, setIsCollapsed = () => {} }: Props = {}) => {
  const settings = useStoreValue('settings');
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<AssistantMessage[]>([]);
  const [chatLoading, setChatLoading] = useState(false);
  const [, setTick] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const forceUpdate = () => setTick((tick) => tick + 1);

  const handleChange = (key: string, value: unknown) =>
    updateSettings({
      [key]: value,
    });

  const handleResetFonts = () =>
    updateSettings({
      bodyFont: defaultSettings.bodyFont,
      headingFont: defaultSettings.headingFont,
      numbersFont: defaultSettings.numbersFont,
      'editor.fontFamily': defaultSettings.editor.fontFamily,
    } as Record<string, unknown>);

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

  const handleChatSend = useCallback(
    async (prompt: string) => {
      const userMessage: AssistantMessage = {
        id: crypto.randomUUID(),
        role: 'user',
        content: prompt,
      };
      const updated = [...chatMessages, userMessage];
      setChatMessages(updated);

      if (!isAiAvailable()) {
        setChatMessages([
          ...updated,
          {
            id: crypto.randomUUID(),
            role: 'assistant',
            content: t('api.configureAiProvider'),
          },
        ]);
        return;
      }

      const msgs: ChatMessage[] = updated.map((m) => ({ role: m.role, content: m.content }));

      setChatLoading(true);
      try {
        const result = await generateAiResponse({
          prompt,
          messages: msgs,
          systemContext: GISTO_APP_CONTEXT,
        });
        setChatMessages((prev) => [
          ...prev,
          { id: crypto.randomUUID(), role: 'assistant', content: result },
        ]);
      } catch (error) {
        const msg =
          error instanceof AiApiError
            ? `Error: ${error.message}`
            : `Error: ${error instanceof Error ? error.message : t('api.unexpectedError')}`;
        setChatMessages((prev) => [
          ...prev,
          { id: crypto.randomUUID(), role: 'assistant', content: msg },
        ]);
      } finally {
        setChatLoading(false);
      }
    },
    [chatMessages]
  );

  const {
    editor,
    externalEditor,
    ai,
    theme,
    baseColor,
    headingFont,
    numbersFont,
    bodyFont,
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
    sidebarViewMode,
  } = settings;

  // Group settings into logical sections
  const appearanceSettings = {
    theme,
    baseColor,
    language,
    dashboardSnippetsOverTimeRange,
  };

  const fontSettings = {
    bodyFont,
    headingFont,
    numbersFont,
  };

  const snippetSettings = {
    newSnippetDefaultLanguage,
    sidebarCollapsedByDefault,
    filesCollapsedByDefault,
    newSnippetPublicByDefault,
    jsonPreviewCollapsedByDefault,
    filesPreviewEnabledByDefault,
    sortFilesByMarkdownFirst,
    sidebarViewMode,
  };

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

            <div className="line-clamp-1">{t('pages.settings.title')}</div>
          </div>
        </div>
      </PageHeader>

      <PageContent>
        <Tabs defaultValue="general" className="w-full">
          <TabsList variant="line" className="w-full">
            <TabsTrigger value="general">{t('pages.settings.general')}</TabsTrigger>
            <TabsTrigger value="editor">{t('pages.settings.editor')}</TabsTrigger>
            <TabsTrigger value="fonts">{t('pages.settings.fonts')}</TabsTrigger>
            <TabsTrigger value="ai">{t('pages.settings.aiAssistant')}</TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>{t('pages.settings.gistoSettings')}</CardTitle>
                  <CardDescription>{t('pages.settings.themeLanguageAndTokens')}</CardDescription>
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
                      {getTranslation(
                        getProviderConfig(activeSnippetProvider as SnippetProviderType).label
                      )}
                    </div>
                  </div>
                  {activeSnippetProvider !== 'local' && activeSnippetProvider !== 'snippet-bin' && (
                    <div className="flex flex-col space-y-1.5">
                      <label className="text-sm font-medium">
                        {getTranslation(
                          getProviderConfig(activeSnippetProvider as SnippetProviderType).tokenLabel
                        )}
                      </label>
                      <InputPassword
                        value={
                          localStorage.getItem(
                            getProviderConfig(activeSnippetProvider as SnippetProviderType).tokenKey
                          ) || ''
                        }
                        onChange={(e) => {
                          localStorage.setItem(
                            getProviderConfig(activeSnippetProvider as SnippetProviderType)
                              .tokenKey,
                            e.target.value
                          );
                          forceUpdate();
                        }}
                        placeholder={getTranslation(
                          getProviderConfig(activeSnippetProvider as SnippetProviderType)
                            .tokenPlaceholder
                        )}
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
                  <DynamicSettings
                    settings={{ ...editor, fontFamily: undefined }}
                    path="editor"
                    onChange={handleChange}
                  />
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
                    beforeMount={(monaco) => defineEditorThemes(monaco)}
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

            <Card className="mt-6">
              <CardHeader>
                <CardTitle>{t('pages.settings.externalEditor')}</CardTitle>
                <CardDescription>{t('pages.settings.externalEditorDescription')}</CardDescription>
              </CardHeader>
              <CardContent>
                <div>
                  <label className="text-sm font-medium block mb-1">
                    {t('pages.settings.editorCommand')}
                  </label>
                  <Input
                    type="text"
                    value={externalEditor.command}
                    placeholder="code"
                    onChange={(e) => handleChange('externalEditor.command', e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    {t('pages.settings.editorCommandHint')}
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="fonts" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>{t('pages.settings.fonts')}</CardTitle>
                  <CardDescription>{t('pages.settings.fontsDescription')}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <DynamicSettings
                    settings={fontSettings as Record<string, unknown>}
                    onChange={handleChange}
                  />
                  <DynamicSettings
                    settings={{ fontFamily: editor.fontFamily }}
                    path="editor"
                    onChange={handleChange}
                  />
                  <Button variant="outline" size="sm" onClick={handleResetFonts}>
                    {t('pages.settings.resetFontsToDefaults')}
                  </Button>
                </CardContent>
              </Card>

              <Card className="lg:sticky lg:top-4 self-start">
                <CardHeader>
                  <CardTitle>{t('pages.settings.preview')}</CardTitle>
                  <CardDescription>{t('pages.settings.fontsDescription')}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between gap-3 text-xs text-muted-foreground">
                      <span>{t('pages.settings.headingFont')}</span>
                      <span className="font-heading truncate text-foreground">
                        {settings.headingFont}
                      </span>
                    </div>
                    <h3 className="font-heading mt-1.5 text-3xl font-semibold leading-tight">
                      {t('pages.settings.fontsPreviewHeading')}
                    </h3>
                    <p className="font-heading mt-1 text-sm leading-relaxed text-muted-foreground">
                      {t('pages.settings.fontsPreviewBody')}
                    </p>
                  </div>

                  <Separator />

                  <div>
                    <div className="flex items-center justify-between gap-3 text-xs text-muted-foreground">
                      <span>{t('pages.settings.bodyFont')}</span>
                      <span className="truncate text-foreground">{settings.bodyFont}</span>
                    </div>
                    <p className="mt-1.5 text-sm leading-relaxed">
                      {t('pages.settings.fontsPreviewBody')}
                    </p>
                  </div>

                  <Separator />

                  <div>
                    <div className="flex items-center justify-between gap-3 text-xs text-muted-foreground">
                      <span>{t('pages.settings.numbersFont')}</span>
                      <span className="font-numbers truncate text-foreground">
                        {settings.numbersFont}
                      </span>
                    </div>
                    <div className="font-numbers mt-1.5 text-2xl font-semibold tracking-wide">
                      0123456789
                    </div>
                    <div className="font-numbers mt-0.5 text-sm text-muted-foreground">
                      128 &middot; 12.4k &middot; 98.6%
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <div className="flex items-center justify-between gap-3 text-xs text-muted-foreground">
                      <span>{t('pages.settings.editorFont')}</span>
                      <span
                        className="truncate text-foreground"
                        style={{ fontFamily: settings.editor.fontFamily }}
                      >
                        {settings.editor.fontFamily}
                      </span>
                    </div>
                    <pre
                      className="mt-1.5 overflow-x-auto rounded-md bg-muted p-3 text-xs leading-relaxed"
                      style={{ fontFamily: settings.editor.fontFamily }}
                    >
                      {`const greet = (name: string): string => {
  return \`Hello, \${name}!\`;
};`}
                    </pre>
                  </div>
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
                  <CardTitle>{t('pages.settings.promptAssistant')}</CardTitle>
                  <CardDescription>{t('pages.settings.interactWithAiDirectly')}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    {t('pages.settings.openAiChatDescription')}
                  </p>
                  <Button onClick={() => setChatOpen(true)} className="w-full gap-2">
                    <Sparkles className="size-4" />
                    {t('pages.settings.openAiChat')}
                  </Button>
                </CardContent>
              </Card>

              <AIChatDialog
                open={chatOpen}
                onOpenChange={setChatOpen}
                messages={chatMessages}
                onSend={handleChatSend}
                onClear={() => setChatMessages([])}
                isLoading={chatLoading}
              />
            </div>
          </TabsContent>
        </Tabs>
      </PageContent>
    </div>
  );
};
