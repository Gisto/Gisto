import { Sun, Moon, LaptopMinimal } from 'lucide-react';
import { ReactNode } from 'react';

import { SimpleTooltip } from '@/components/simple-tooltip.tsx';
import { useTheme, type Theme } from '@/components/theme/theme-provider.tsx';
import { Input } from '@/components/ui/input.tsx';
import { InputPassword } from '@/components/ui/inputPassword.tsx';
import { Label } from '@/components/ui/label.tsx';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group.tsx';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select.tsx';
import { Slider } from '@/components/ui/slider.tsx';
import { Switch } from '@/components/ui/switch.tsx';
import { AI_PROVIDERS } from '@/constants';
import { languageMap } from '@/constants/language-map.ts';
import { t } from '@/lib/i18n';
import { SettingsType } from '@/lib/store/globalState.ts';
import {
  camelToTitleCase,
  getCountryNameFromLanguage,
  getFlagEmojiFromLanguage,
  upperCaseFirst,
} from '@/lib/utils';

interface SettingsProps {
  settings: Omit<SettingsType, 'editor'> | SettingsType['editor'] | Record<string, unknown>;
  onChange: (key: string, value: unknown) => void;
  path?: string;
}

const SpecialSelect = ({
  settingKey,
  value,
  onChange,
  fullPath,
  options,
  tooltip,
  label,
}: {
  settingKey: string;
  value: string;
  onChange: (path: string, value: string) => void;
  fullPath: string;
  options: { value: string; label: string }[];
  tooltip?: ReactNode;
  label?: ReactNode;
}) => {
  return (
    <div className="mb-4">
      <label className="mb-1 flex items-center gap-2">
        {label ?? camelToTitleCase(settingKey)}
        {tooltip && <SimpleTooltip className="max-w-2xs" content={tooltip} />}
      </label>
      <Select onValueChange={(value) => onChange(fullPath, value)} value={value}>
        <SelectTrigger>
          <SelectValue placeholder={upperCaseFirst(t('common.select'))} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export const DynamicSettings = ({ settings, onChange, path = '' }: SettingsProps) => {
  const { setTheme } = useTheme();

  const renderSetting = (key: string, value: SettingsType | unknown, currentPath: string) => {
    const fullPath = currentPath ? `${currentPath}.${key}` : key;

    // temp migration
    if (path === 'editor' && key === 'wordWrap' && typeof value === 'boolean') {
      onChange('editor.wordWrap', 'wordWrapColumn');
    }

    if (typeof value === 'object' && value !== null) {
      return (
        <div key={key} className="flex items-center space-x-2 mb-4">
          <DynamicSettings settings={value as SettingsType} onChange={onChange} path={fullPath} />
          <label className=" mb-4">{camelToTitleCase(key)}</label>
        </div>
      );
    }

    switch (typeof value) {
      case 'boolean': {
        return (
          <div key={key} className="flex items-center space-x-2 mb-4">
            <Switch checked={value} onCheckedChange={(checked) => onChange(fullPath, checked)} />
            <label>{camelToTitleCase(key)}</label>
          </div>
        );
      }

      case 'number': {
        return (
          <div key={key} className="mb-4">
            <label className="block mb-1">
              {camelToTitleCase(key)} <small>({value})</small>
            </label>

            <Slider
              value={[value]}
              onValueChange={(val) => onChange(fullPath, val[0])}
              min={0}
              max={100}
              step={1}
            />
          </div>
        );
      }

      case 'string':
        {
          if (key === 'theme') {
            return (
              <>
                <label className="block mb-1">{t('theme.theme')}</label>
                <RadioGroup
                  className="grid grid-cols-3 gap-4 mb-4"
                  onValueChange={(value: Theme) => {
                    onChange(fullPath, value);
                    setTheme(value);
                  }}
                  defaultValue={value}
                >
                  <div>
                    <RadioGroupItem
                      value="light"
                      id="light"
                      className="peer sr-only"
                      aria-label={t('theme.light')}
                    />
                    <Label
                      htmlFor="light"
                      className="cursor-pointer flex gap-3 flex-col items-center justify-between rounded-lg border-2 border-muted bg-transparent p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                    >
                      <Sun className="stroke-primary" />
                      {t('theme.light')}
                    </Label>
                  </div>
                  <div>
                    <RadioGroupItem
                      value="dark"
                      id="dark"
                      className="peer sr-only"
                      aria-label={t('theme.dark')}
                    />
                    <Label
                      htmlFor="dark"
                      className="cursor-pointer flex gap-3 flex-col items-center justify-between rounded-lg border-2 border-muted bg-transparent p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                    >
                      <Moon className="stroke-primary" />
                      {t('theme.dark')}
                    </Label>
                  </div>
                  <div>
                    <RadioGroupItem
                      value="system"
                      id="system"
                      className="peer sr-only"
                      aria-label={t('theme.system')}
                    />
                    <Label
                      htmlFor="system"
                      className="cursor-pointer flex gap-3 flex-col items-center justify-between rounded-lg border-2 border-muted bg-transparent p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                    >
                      <LaptopMinimal className="stroke-primary" />
                      {t('theme.system')}
                    </Label>
                  </div>
                </RadioGroup>
              </>
            );
          }

          // editor line numbers
          if (key === 'lineNumbers') {
            return (
              <SpecialSelect
                settingKey={key}
                value={value}
                onChange={onChange}
                fullPath={fullPath}
                options={[
                  { value: 'on', label: upperCaseFirst(t('common.on')) },
                  { value: 'off', label: upperCaseFirst(t('common.off')) },
                ]}
              />
            );
          }

          if (key === 'wordWrap') {
            return (
              <SpecialSelect
                settingKey={key}
                value={value}
                onChange={onChange}
                fullPath={fullPath}
                options={[
                  { value: 'on', label: upperCaseFirst(t('common.on')) },
                  { value: 'off', label: upperCaseFirst(t('common.off')) },
                  { value: 'wordWrapColumn', label: t('pages.settings.wordWrapColumn') },
                  { value: 'bounded', label: t('pages.settings.bounded') },
                ]}
              />
            );
          }

          if (key === 'language') {
            return (
              <SpecialSelect
                tooltip={
                  <div className="text-primary-foreground">
                    {t('pages.settings.experimentalTranslation')}
                  </div>
                }
                settingKey={key}
                label={t('pages.settings.uiLanguage')}
                value={value}
                onChange={(keyVal, lang) => {
                  onChange(keyVal, lang);
                  document.location.reload();
                }}
                fullPath={fullPath}
                options={[
                  {
                    value: 'en',
                    label:
                      getFlagEmojiFromLanguage('en') + ' ' + getCountryNameFromLanguage('en', 'en'),
                  },
                  {
                    value: 'es',
                    label:
                      getFlagEmojiFromLanguage('es') + ' ' + getCountryNameFromLanguage('es', 'es'),
                  },
                  {
                    value: 'fr',
                    label:
                      getFlagEmojiFromLanguage('fr') + ' ' + getCountryNameFromLanguage('fr', 'fr'),
                  },
                  {
                    value: 'de',
                    label:
                      getFlagEmojiFromLanguage('de') + ' ' + getCountryNameFromLanguage('de', 'de'),
                  },
                  {
                    value: 'ru',
                    label:
                      getFlagEmojiFromLanguage('ru') + ' ' + getCountryNameFromLanguage('ru', 'ru'),
                  },
                  {
                    value: 'zh',
                    label:
                      getFlagEmojiFromLanguage('zh') + ' ' + getCountryNameFromLanguage('zh', 'zh'),
                  },
                  // TODO: Add more languages like jp, etc. PRS are always welcome
                ]}
              />
            );
          }

          if (key === 'newSnippetDefaultLanguage') {
            return (
              <SpecialSelect
                settingKey={key}
                value={value}
                onChange={onChange}
                fullPath={fullPath}
                options={Object.keys(languageMap).map((language) => ({
                  value: language,
                  label: language,
                }))}
              />
            );
          }

          if (key === 'activeAiProvider') {
            const providers: Array<'openai' | 'gemini' | 'claude' | 'openrouter'> = [
              'openai',
              'gemini',
              'claude',
              'openrouter',
            ];

            return (
              <>
                <label className="block mb-4 font-medium">{t('pages.settings.aiProvider')}</label>
                <RadioGroup
                  className="grid grid-cols-2 gap-4 mb-4"
                  onValueChange={(selectedValue) => {
                    onChange(fullPath, selectedValue);
                  }}
                  defaultValue={value}
                >
                  {providers.map((provider) => {
                    const providerData = AI_PROVIDERS[provider];
                    if (!providerData) return null;

                    const IconComponent = providerData.icon;

                    return (
                      <div key={provider}>
                        <RadioGroupItem
                          value={provider}
                          id={`provider-${provider}`}
                          className="peer sr-only"
                          aria-label={providerData.label}
                        />
                        <Label
                          htmlFor={`provider-${provider}`}
                          className="cursor-pointer flex gap-3 flex-col items-center justify-between rounded-lg border-2 border-muted bg-transparent p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                        >
                          <div className="w-8 h-8">
                            <IconComponent />
                          </div>
                          <div className="text-sm font-medium">{providerData.label}</div>
                          <small className="text-xs text-muted-foreground text-center">
                            {providerData.description}
                          </small>
                        </Label>
                      </div>
                    );
                  })}
                </RadioGroup>
              </>
            );
          }

          // API Key fields
          if (
            key === 'openaiApiKey' ||
            key === 'geminiApiKey' ||
            key === 'claudeApiKey' ||
            key === 'openRouterApiKey'
          ) {
            const providerMap: Record<string, 'openai' | 'gemini' | 'claude' | 'openrouter'> = {
              openaiApiKey: 'openai',
              geminiApiKey: 'gemini',
              claudeApiKey: 'claude',
              openRouterApiKey: 'openrouter',
            };
            const provider = providerMap[key];
            const aiSettings = path === 'ai' ? (settings as Record<string, unknown>) : null;
            const activeProvider = (aiSettings?.activeAiProvider as string) || 'openrouter';

            // Only show the API key field for the currently selected provider
            if (provider !== activeProvider) {
              return null;
            }

            const providerData = AI_PROVIDERS[provider];

            return (
              <div key={key} className="mb-4">
                <label className="mb-2 flex items-center gap-2 text-sm font-medium">
                  {t('pages.settings.apiKey')}
                  {providerData?.apiKeyUrl && (
                    <SimpleTooltip
                      className="max-w-2xs"
                      content={
                        <div className="text-primary-foreground">
                          {t('pages.settings.getApiKey', {
                            provider: providerData.label,
                            url: providerData.apiKeyUrl,
                          })}
                        </div>
                      }
                    />
                  )}
                </label>
                <InputPassword
                  value={value}
                  onChange={(e) => onChange(fullPath, e.target.value)}
                  placeholder={t('pages.settings.apiKeyPlaceholder')}
                  className="w-full"
                />
              </div>
            );
          }

          // Model selection
          if (key === 'model') {
            const aiSettings = path === 'ai' ? (settings as Record<string, unknown>) : null;
            const currentProvider = (aiSettings?.activeAiProvider as string) || 'openrouter';
            const providerData = AI_PROVIDERS[currentProvider as keyof typeof AI_PROVIDERS];
            const modelOptions = providerData?.modelOptions || [];

            return (
              <div key={key} className="mb-4">
                <label className="mb-2 block text-sm font-medium">{t('pages.settings.model')}</label>
                <Select onValueChange={(val) => onChange(fullPath, val)} value={value}>
                  <SelectTrigger>
                    <SelectValue placeholder={upperCaseFirst(t('common.select'))} />
                  </SelectTrigger>
                  <SelectContent>
                    {modelOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            );
          }

          // Temperature slider
          if (key === 'temperature') {
            const tempValue = parseFloat(value as string);
            return (
              <div key={key} className="mb-4">
                <label className="mb-2 flex items-center gap-2 text-sm font-medium">
                  {t('pages.settings.temperature')} <small>({tempValue})</small>
                </label>
                <Slider
                  value={[tempValue]}
                  onValueChange={(val) => onChange(fullPath, val[0])}
                  min={0}
                  max={2}
                  step={0.1}
                />
              </div>
            );
          }
        }

        return (
          <div key={key} className="mb-4">
            <label className="block mb-1">{camelToTitleCase(key)}</label>
            <Input type="text" value={value} onChange={(e) => onChange(fullPath, e.target.value)} />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div>{Object.entries(settings).map(([key, value]) => renderSetting(key, value, path))}</div>
  );
};
