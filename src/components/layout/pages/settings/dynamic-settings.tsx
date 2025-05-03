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
  settings: Omit<SettingsType, 'editor'> | SettingsType['editor'];
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
                  <>
                    <strong>Experimental</strong>, machine translated, some translations are not
                    accurate or not available.
                  </>
                }
                settingKey={key}
                label="UI language (experimental)"
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

          if (key === 'geminiApiKey') {
            return (
              <div key={key} className="mb-4">
                <label className="mb-1 flex items-center gap-2">
                  {camelToTitleCase(key)}
                  <SimpleTooltip
                    className="max-w-2xs"
                    content={
                      <div>
                        Get your Gemini API key at{' '}
                        <a
                          className="text-primary-foreground hover:text-primary-foreground underline"
                          target="_blank"
                          href="https://aistudio.google.com/app/apikey"
                        >
                          https://aistudio.google.com/app/apikey
                        </a>
                        .
                        <br />
                        <br />
                        It can be used to generate snippets description and tags on edit or create
                        page.
                        <br />
                        <br />
                        After adding the key, you will see assistant button near the description on
                        edit or create page.
                      </div>
                    }
                  />
                </label>
                <InputPassword
                  value={value}
                  onChange={(e) => onChange(fullPath, e.target.value)}
                  placeholder="your api key"
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
