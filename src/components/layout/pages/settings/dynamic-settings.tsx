import { Sun, Moon, LaptopMinimal, RefreshCw, Info, Check } from 'lucide-react';
import { ReactNode } from 'react';

import { SimpleTooltip } from '@/components/simple-tooltip.tsx';
import { useTheme, type Theme } from '@/components/theme/theme-provider.tsx';
import { Input } from '@/components/ui/input.tsx';
import { InputPassword } from '@/components/ui/inputPassword.tsx';
import { Label } from '@/components/ui/label.tsx';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group.tsx';
import {
  SearchableSelect,
  type SearchableSelectOption,
} from '@/components/ui/searchable-select.tsx';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select.tsx';
import { Slider } from '@/components/ui/slider.tsx';
import { Switch } from '@/components/ui/switch.tsx';
import { AI_PROVIDERS, MINIMAX_PROTOCOL_OPTIONS, MINIMAX_REGION_OPTIONS } from '@/constants';
import { languageMap } from '@/constants/language-map.ts';
import { useAiModels } from '@/hooks/use-ai-models';
import { useGoogleFonts } from '@/hooks/use-google-fonts';
import { t } from '@/lib/i18n';
import { SettingsType } from '@/lib/store/globalState.ts';
import { cn } from '@/utils';
import {
  camelToTitleCase,
  getCountryNameFromLanguage,
  getFlagEmojiFromLanguage,
  upperCaseFirst,
} from '@/utils';

interface SettingsProps {
  settings: Omit<SettingsType, 'editor'> | SettingsType['editor'] | Record<string, unknown>;
  onChange: (key: string, value: unknown) => void;
  path?: string;
}

const BASE_COLORS = [
  { value: '201 45.5% 45.3%', hex: '#3F83A8', labelKey: 'pages.settings.baseColors.teal' },
  { value: '217 83% 53%', hex: '#2470EB', labelKey: 'pages.settings.baseColors.blue' },
  { value: '243 75% 59%', hex: '#5048E5', labelKey: 'pages.settings.baseColors.indigo' },
  { value: '270 81% 56%', hex: '#8F34EA', labelKey: 'pages.settings.baseColors.purple' },
  { value: '330 81% 60%', hex: '#EC4699', labelKey: 'pages.settings.baseColors.pink' },
  { value: '0 72% 51%', hex: '#DC2828', labelKey: 'pages.settings.baseColors.red' },
  { value: '21 90% 48%', hex: '#E9590C', labelKey: 'pages.settings.baseColors.orange' },
  { value: '32 95% 44%', hex: '#DB7706', labelKey: 'pages.settings.baseColors.amber' },
  { value: '142 71% 39%', hex: '#1DAA51', labelKey: 'pages.settings.baseColors.green' },
  { value: '161 94% 30%', hex: '#059467', labelKey: 'pages.settings.baseColors.emerald' },
  { value: '192 91% 36%', hex: '#088EAF', labelKey: 'pages.settings.baseColors.cyan' },
  { value: '200 98% 39%', hex: '#0284C5', labelKey: 'pages.settings.baseColors.sky' },
] as const;

const HSL_TRIPLET_REGEX = /^([\d.]+)\s+([\d.]+)%\s+([\d.]+)%$/;

function formatHslPart(value: number) {
  const rounded = Math.round(value * 10) / 10;
  return Number.isInteger(rounded) ? String(rounded) : rounded.toFixed(1);
}

function hslTripletToHex(hsl: string): string {
  const match = hsl.trim().match(HSL_TRIPLET_REGEX);
  if (!match) return '#3F83A8';
  const h = parseFloat(match[1]);
  const s = parseFloat(match[2]) / 100;
  const l = parseFloat(match[3]) / 100;
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;
  let r = 0;
  let g = 0;
  let b = 0;
  if (h < 60) {
    [r, g, b] = [c, x, 0];
  } else if (h < 120) {
    [r, g, b] = [x, c, 0];
  } else if (h < 180) {
    [r, g, b] = [0, c, x];
  } else if (h < 240) {
    [r, g, b] = [0, x, c];
  } else if (h < 300) {
    [r, g, b] = [x, 0, c];
  } else {
    [r, g, b] = [c, 0, x];
  }
  const toHex = (v: number) =>
    Math.round((v + m) * 255)
      .toString(16)
      .padStart(2, '0');
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase();
}

function hexToHslTriplet(hex: string): string {
  const normalized = hex.replace('#', '');
  const r = parseInt(normalized.substring(0, 2), 16) / 255;
  const g = parseInt(normalized.substring(2, 4), 16) / 255;
  const b = parseInt(normalized.substring(4, 6), 16) / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  const d = max - min;
  let h = 0;
  let s = 0;
  if (d !== 0) {
    s = d / (1 - Math.abs(2 * l - 1));
    if (max === r) h = ((g - b) / d) % 6;
    else if (max === g) h = (b - r) / d + 2;
    else h = (r - g) / d + 4;
    h *= 60;
    if (h < 0) h += 360;
  }
  return `${formatHslPart(h)} ${formatHslPart(s * 100)}% ${formatHslPart(l * 100)}%`;
}

const SpecialSelect = ({
  settingKey,
  value,
  onChange,
  fullPath,
  options,
  tooltip,
  label,
  disabled,
}: {
  settingKey: string;
  value: string;
  onChange: (path: string, value: string) => void;
  fullPath: string;
  options: { value: string; label: string }[];
  tooltip?: ReactNode;
  label?: ReactNode;
  disabled?: boolean;
}) => {
  return (
    <div className="mb-4">
      <label className="mb-1 flex items-center gap-2">
        {label ?? camelToTitleCase(settingKey)}
        {tooltip && <SimpleTooltip className="max-w-2xs" content={tooltip} />}
      </label>
      <Select
        onValueChange={(value) => onChange(fullPath, value)}
        value={value}
        disabled={disabled}
      >
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

function ModelSelect({
  value,
  onChange,
  fullPath,
  provider,
}: {
  value: string;
  onChange: (path: string, value: string) => void;
  fullPath: string;
  provider: string;
}) {
  const { models, isLoading, error, refresh } = useAiModels(provider);

  const selectedModel = models.find((m) => m.value === value);
  const freeCount = models.filter((m) => m.isFree).length;

  const options: SearchableSelectOption<string>[] = models.map((m) => ({
    label: m.label,
    value: m.value,
    disabled: false,
  }));

  return (
    <div className="mb-4">
      <label className="mb-2 flex items-center gap-2 text-sm font-medium">
        {t('pages.settings.model')}
        <SimpleTooltip
          className="max-w-xs"
          content={
            <div className="space-y-1 text-primary-foreground text-xs">
              <p className="font-medium">{AI_PROVIDERS[provider]?.label ?? provider}</p>
              <p>{t('components.selected', { label: selectedModel?.label ?? value })}</p>
              <p>
                {t('components.available', { freeCount, paidCount: models.length - freeCount })}
              </p>
              {error && (
                <p className="text-destructive-foreground mt-1">
                  {t('components.error', { error })}
                </p>
              )}
            </div>
          }
        />
        {isLoading && !error && (
          <RefreshCw className="size-3.5 animate-spin text-muted-foreground" />
        )}
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            refresh();
          }}
          className="ml-auto"
        >
          <RefreshCw className="size-3.5 text-muted-foreground hover:text-foreground transition-colors" />
        </button>
      </label>
      {error && models.length === 0 ? (
        <div className="px-2 py-4 text-center text-sm text-muted-foreground rounded-md border">
          {t('components.failedToLoadModels')}
        </div>
      ) : (
        <SearchableSelect
          options={options}
          value={value}
          onChange={(val) => onChange(fullPath, val)}
          placeholder={
            isLoading ? t('components.loadingModels') : upperCaseFirst(t('common.select'))
          }
          searchPlaceholder={t('components.searchModels')}
          loading={isLoading && models.length === 0}
          itemRenderer={(option) => {
            const model = models.find((m) => m.value === option.value);
            if (!model) return <span>{option.label}</span>;

            return (
              <span className="flex items-center gap-1.5 w-full">
                <span className="flex-1 min-w-0 truncate text-sm">{model.label}</span>
                <SimpleTooltip
                  content={
                    <div className="text-xs space-y-1 max-w-64">
                      {model.description && (
                        <p className="text-muted-foreground leading-relaxed">{model.description}</p>
                      )}
                      <p className="text-muted-foreground/60">{model.modelId ?? model.value}</p>
                      <div className="flex flex-wrap gap-x-2 gap-y-0.5">
                        {model.contextLength && (
                          <span>
                            {t('components.contextK', {
                              n: (model.contextLength / 1000).toLocaleString(),
                            })}
                          </span>
                        )}
                        {model.pricing ? (
                          <span>
                            ${(model.pricing.prompt * 1_000_000).toFixed(2)}/M in &middot; $
                            {(model.pricing.completion * 1_000_000).toFixed(2)}/M out
                          </span>
                        ) : (
                          <span>{model.isFree ? t('components.free') : t('components.paid')}</span>
                        )}
                      </div>
                    </div>
                  }
                >
                  <span onPointerDown={(e) => e.stopPropagation()}>
                    <Info className="size-3 shrink-0 text-muted-foreground cursor-help" />
                  </span>
                </SimpleTooltip>
              </span>
            );
          }}
        />
      )}
    </div>
  );
}

export const DynamicSettings = ({ settings, onChange, path = '' }: SettingsProps) => {
  const { setTheme } = useTheme();
  const { fonts: googleFonts, isLoading: isGoogleFontsLoading } = useGoogleFonts();

  const renderFontPicker = (
    key: string,
    value: unknown,
    label: string,
    fullPath: string,
    monospaceOnly = false
  ) => {
    const fontOptions: SearchableSelectOption<string>[] = monospaceOnly
      ? [
          { value: 'monospace', label: t('pages.settings.systemMonospace') },
          ...googleFonts
            .filter((font) => font.category.toLowerCase() === 'monospace')
            .map((font) => ({ value: font.family, label: font.family })),
        ]
      : googleFonts.map((font) => ({ value: font.family, label: font.family }));

    return (
      <div key={key} className="mb-4">
        <label className="block mb-1">{label}</label>
        <SearchableSelect
          options={fontOptions}
          value={value}
          onChange={(val) => onChange(fullPath, val)}
          searchPlaceholder={t('components.searchFonts')}
          loading={isGoogleFontsLoading && fontOptions.length === 0}
          itemRenderer={(option) => (
            <span className="text-sm" style={{ fontFamily: `"${option.value}", serif` }}>
              {option.label}
            </span>
          )}
        />
      </div>
    );
  };

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
          if (key === 'lineNumbers') {
            return (
              <div key={key} className="flex items-center space-x-2 mb-4">
                <Switch
                  checked={value === 'on'}
                  onCheckedChange={(checked) => onChange(fullPath, checked ? 'on' : 'off')}
                />
                <label>{camelToTitleCase(key)}</label>
              </div>
            );
          }

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

          if (key === 'baseColor') {
            const current = value as string;
            return (
              <div key={key} className="mb-4">
                <label className="block mb-2 text-sm font-medium">
                  {t('pages.settings.baseColor')}
                </label>
                <div className="flex items-center gap-1.5">
                  {BASE_COLORS.map((color) => {
                    const selected = current === color.value;
                    return (
                      <button
                        key={color.value}
                        type="button"
                        title={t(color.labelKey)}
                        aria-label={t(color.labelKey)}
                        aria-pressed={selected}
                        onClick={() => onChange(fullPath, color.value)}
                        className={cn(
                          'flex size-7 items-center justify-center rounded-full border transition-transform hover:scale-110',
                          selected
                            ? 'border-foreground ring-2 ring-primary ring-offset-2 ring-offset-background'
                            : 'border-border'
                        )}
                        style={{ backgroundColor: color.hex }}
                      >
                        {selected && (
                          <Check
                            className="size-3.5 text-white drop-shadow-[0_1px_1px_rgba(0,0,0,0.4)]"
                            strokeWidth={3}
                          />
                        )}
                      </button>
                    );
                  })}
                  <label
                    title={t('pages.settings.customColor')}
                    className="relative ml-0.5 flex size-7 cursor-pointer items-center justify-center overflow-hidden rounded-full border border-dashed border-muted-foreground/50 transition-transform hover:scale-110"
                  >
                    <span
                      aria-hidden
                      className="absolute inset-0 opacity-25 bg-[conic-gradient(from_0deg,red,yellow,lime,cyan,blue,magenta,red)]"
                    />
                    <input
                      type="color"
                      value={hslTripletToHex(current)}
                      onChange={(e) => onChange(fullPath, hexToHslTriplet(e.target.value))}
                      className="absolute inset-0 size-full cursor-pointer opacity-0"
                      aria-label={t('pages.settings.customColor')}
                    />
                  </label>
                </div>
              </div>
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

          if (key === 'renderWhitespace') {
            return (
              <SpecialSelect
                settingKey={key}
                value={value}
                onChange={onChange}
                fullPath={fullPath}
                options={[
                  { value: 'none', label: upperCaseFirst(t('common.off')) },
                  { value: 'selection', label: t('pages.settings.selection') },
                  { value: 'boundary', label: t('pages.settings.boundary') },
                  { value: 'trailing', label: t('pages.settings.trailing') },
                  { value: 'all', label: t('pages.settings.all') },
                ]}
              />
            );
          }

          if (key === 'renderLineHighlight') {
            return (
              <SpecialSelect
                settingKey={key}
                value={value}
                onChange={onChange}
                fullPath={fullPath}
                options={[
                  { value: 'line', label: t('pages.settings.line') },
                  { value: 'all', label: t('pages.settings.all') },
                  { value: 'gutter', label: t('pages.settings.gutter') },
                  { value: 'none', label: upperCaseFirst(t('common.off')) },
                ]}
              />
            );
          }

          if (key === 'snippetBinBaseUrl') {
            const activeProvider = (settings as Record<string, unknown>)?.activeSnippetProvider;
            if (activeProvider !== 'snippet-bin') {
              return null;
            }
            return (
              <div key={key} className="mb-4">
                <label className="block mb-1">{t('login.snippetBinBaseUrl')}</label>
                <Input
                  type="text"
                  value={value}
                  onChange={(e) => onChange(fullPath, e.target.value)}
                />
              </div>
            );
          }

          if (key === 'activeSnippetProvider') {
            return (
              <SpecialSelect
                settingKey={key}
                label={t('pages.settings.snippetProvider')}
                value={value}
                onChange={onChange}
                fullPath={fullPath}
                options={[
                  { value: 'github', label: t('login.providerGithub') },
                  { value: 'gitlab', label: t('login.providerGitlab') },
                  { value: 'snippet-bin', label: t('login.providerSnippetBin') },
                  { value: 'local', label: t('login.providerLocal') },
                ]}
              />
            );
          }

          if (key === 'dashboardSnippetsOverTimeRange') {
            return (
              <SpecialSelect
                settingKey={key}
                value={value}
                onChange={onChange}
                fullPath={fullPath}
                options={[
                  { value: '7days', label: t('pages.dashboard.oneWeekAgo') },
                  { value: '30days', label: t('pages.dashboard.oneMonthAgo') },
                  { value: '6months', label: t('pages.dashboard.sixMonthsAgo') },
                  { value: '1year', label: t('pages.dashboard.oneYearAgo') },
                ]}
              />
            );
          }

          if (key === 'sidebarViewMode') {
            return (
              <SpecialSelect
                settingKey={key}
                value={value}
                onChange={onChange}
                fullPath={fullPath}
                options={[
                  { value: 'list', label: upperCaseFirst(t('common.list')) },
                  { value: 'tags', label: upperCaseFirst(t('common.tags')) },
                  { value: 'languages', label: upperCaseFirst(t('common.languages')) },
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
                  {
                    value: 'ja',
                    label:
                      getFlagEmojiFromLanguage('ja') + ' ' + getCountryNameFromLanguage('ja', 'ja'),
                  },
                ]}
              />
            );
          }

          if (key === 'newSnippetDefaultLanguage') {
            const langOptions: SearchableSelectOption<string>[] = Object.keys(languageMap).map(
              (language) => ({
                value: language,
                label: language,
              })
            );
            return (
              <div className="mb-4">
                <label className="block mb-1">{camelToTitleCase(key)}</label>
                <SearchableSelect
                  options={langOptions}
                  value={value}
                  onChange={(val) => onChange(fullPath, val)}
                  searchPlaceholder={t('components.searchLanguages')}
                />
              </div>
            );
          }

          if (key === 'headingFont' || key === 'numbersFont' || key === 'bodyFont') {
            const fontLabels: Record<string, string> = {
              headingFont: t('pages.settings.headingFont'),
              numbersFont: t('pages.settings.numbersFont'),
              bodyFont: t('pages.settings.bodyFont'),
            };
            return renderFontPicker(key, value, fontLabels[key], fullPath);
          }

          if (path === 'editor' && key === 'fontFamily') {
            return renderFontPicker(key, value, t('pages.settings.editorFont'), fullPath, true);
          }

          if (key === 'activeAiProvider') {
            const providers = Object.keys(AI_PROVIDERS);
            const selectedProvider = AI_PROVIDERS[value as string];
            const SelectedIcon = selectedProvider?.icon;

            return (
              <div key={key} className="mb-4">
                <label className="block mb-2 font-medium">{t('pages.settings.aiProvider')}</label>
                <Select
                  value={value}
                  onValueChange={(selectedValue) => {
                    onChange(fullPath, selectedValue);
                  }}
                >
                  <SelectTrigger className="w-full h-auto min-h-[72px] px-4 py-3">
                    <div className="flex items-center gap-3">
                      {SelectedIcon && (
                        <span className="w-8 h-8 shrink-0">
                          <SelectedIcon />
                        </span>
                      )}
                      <div className="text-left">
                        <div className="text-sm font-medium">
                          {selectedProvider?.label ?? t('pages.settings.aiProvider')}
                        </div>
                        {selectedProvider && (
                          <div className="text-xs text-muted-foreground mt-0.5">
                            {selectedProvider.description}
                          </div>
                        )}
                      </div>
                    </div>
                  </SelectTrigger>
                  <SelectContent className="min-w-[var(--radix-select-trigger-width)] p-2">
                    {providers.map((provider) => {
                      const providerData = AI_PROVIDERS[provider];
                      if (!providerData) return null;

                      const IconComponent = providerData.icon;

                      return (
                        <SelectItem
                          key={provider}
                          value={provider}
                          className="cursor-pointer rounded-lg px-3 py-3 pl-3"
                        >
                          <div className="flex items-center gap-3">
                            <span className="w-8 h-8 shrink-0">
                              <IconComponent />
                            </span>
                            <div>
                              <div className="text-sm font-medium">{providerData.label}</div>
                              <div className="text-xs text-muted-foreground mt-0.5">
                                {providerData.description}
                              </div>
                            </div>
                          </div>
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>
            );
          }

          if (key === 'minimaxRegion' || key === 'minimaxProtocol') {
            const aiSettings = path === 'ai' ? (settings as Record<string, unknown>) : null;
            const activeProvider = (aiSettings?.activeAiProvider as string) || 'openrouter';

            if (activeProvider !== 'minimax') {
              return null;
            }

            return (
              <SpecialSelect
                key={key}
                settingKey={key}
                value={value}
                onChange={onChange}
                fullPath={fullPath}
                options={
                  key === 'minimaxRegion' ? MINIMAX_REGION_OPTIONS : MINIMAX_PROTOCOL_OPTIONS
                }
                label={key === 'minimaxRegion' ? 'MiniMax region' : 'API protocol'}
              />
            );
          }

          // API Key fields
          if (
            key === 'openaiApiKey' ||
            key === 'geminiApiKey' ||
            key === 'claudeApiKey' ||
            key === 'minimaxApiKey' ||
            key === 'openRouterApiKey'
          ) {
            const providerMap: Record<
              string,
              'openai' | 'gemini' | 'claude' | 'minimax' | 'openrouter'
            > = {
              openaiApiKey: 'openai',
              geminiApiKey: 'gemini',
              claudeApiKey: 'claude',
              minimaxApiKey: 'minimax',
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

            return (
              <ModelSelect
                key={currentProvider}
                value={value}
                onChange={onChange}
                fullPath={fullPath}
                provider={currentProvider}
              />
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
