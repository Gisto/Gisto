import { ExternalLink } from 'lucide-react';
import { useState } from 'react';

import { ThemeProvider } from '@/components/theme/theme-provider.tsx';
import { ThemeSwitcher } from '@/components/theme/theme-switcher.tsx';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert.tsx';
import { Button } from '@/components/ui/button.tsx';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card.tsx';
import { Input } from '@/components/ui/input.tsx';
import { InputPassword } from '@/components/ui/inputPassword.tsx';
import { Label } from '@/components/ui/label.tsx';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group.tsx';
import { Updater } from '@/components/updater.tsx';
import {
  getProviderConfig,
  getTranslation,
  PROVIDER_CONFIGS,
  SnippetProviderType,
} from '@/constants/providers.tsx';
import { t } from '@/lib/i18n';
import { globalState } from '@/lib/store/globalState.ts';
import { cn } from '@/utils';

type LoginProps = {
  onTokenSubmit: (
    token: string,
    provider: SnippetProviderType,
    snippetBinBaseUrl?: string
  ) => void;
  token: string | null;
  isValid: boolean | null;
};

export const Login = ({ onTokenSubmit, token, isValid }: LoginProps) => {
  const [newToken, setNewToken] = useState<string>('');
  const [provider, setProvider] = useState<SnippetProviderType>('github');
  const [snippetBinBaseUrl, setSnippetBinBaseUrl] = useState<string>(
    globalState.getState().settings.snippetBinBaseUrl
  );

  const config = getProviderConfig(provider);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (provider === 'local') {
      onTokenSubmit('', 'local');
    } else if (provider === 'snippet-bin') {
      onTokenSubmit(newToken, 'snippet-bin', snippetBinBaseUrl);
      setNewToken('');
    } else if (newToken) {
      onTokenSubmit(newToken, provider);
      setNewToken('');
    }
  };

  const helpUrl = config.helpUrl || '';

  const showTokenField = provider !== 'local';

  const renderProviderSelection = () => (
    <div className="flex flex-col space-y-1.5">
      <Label htmlFor="provider">{t('pages.settings.snippetProvider')}</Label>
      <RadioGroup
        id="provider"
        className="grid grid-cols-4 gap-3"
        onValueChange={(value) => setProvider(value as SnippetProviderType)}
        value={provider}
      >
        {Object.values(PROVIDER_CONFIGS).map((option) => (
          <div key={option.value}>
            <RadioGroupItem
              value={option.value}
              id={`provider-${option.value}`}
              className="peer sr-only"
              aria-label={getTranslation(option.label)}
            />

            <Label
              htmlFor={`provider-${option.value}`}
              className="cursor-pointer flex flex-col items-center justify-center gap-1 rounded-lg border-2 border-muted bg-transparent px-2 py-4 text-xs font-medium hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary min-h-[80px]"
            >
              <span className="size-5 text-current" aria-hidden="true">
                <option.Icon className="size-5" />
              </span>
              <span className="text-center">{getTranslation(option.label)}</span>
            </Label>
          </div>
        ))}
      </RadioGroup>

      {config.warning && (
        <Alert
          className={cn(
            'max-w-md mt-2 animate-in fade-in slide-in-from-top-2 duration-200',
            provider === 'gitlab'
              ? 'border-amber-200 text-amber-900 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-50'
              : 'border-blue-200 text-blue-900 dark:border-blue-900 dark:bg-blue-950 dark:text-blue-50'
          )}
        >
          <config.warning.Icon size="16" />
          <AlertTitle>{getTranslation(config.warning.title)}</AlertTitle>
          <AlertDescription>{getTranslation(config.warning.description)}</AlertDescription>
        </Alert>
      )}
    </div>
  );

  const renderTokenFields = () => (
    <div
      className={cn(
        'grid transition-all duration-300 ease-in-out',
        showTokenField ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
      )}
    >
      <div className="overflow-hidden">
        <div className={cn(!showTokenField && 'hidden')}>
          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="token">{getTranslation(config.tokenLabel)}</Label>

            <InputPassword
              id="token"
              value={newToken}
              onChange={(e) => setNewToken(e.target.value)}
              placeholder={getTranslation(config.tokenPlaceholder)}
            />

            {provider === 'snippet-bin' && (
              <div className="flex flex-col space-y-1.5 mt-4">
                <Label htmlFor="baseUrl">{t('login.snippetBinBaseUrl')}</Label>
                <Input
                  id="baseUrl"
                  value={snippetBinBaseUrl}
                  onChange={(e) => setSnippetBinBaseUrl(e.target.value)}
                  placeholder={t('login.enterSnippetBinBaseUrl')}
                />
              </div>
            )}
            {token !== null && !isValid && (
              <div className="mb-4 text-xs text-destructive">{t('login.tokenNotValid')}</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col justify-center items-center h-screen bg-secondary bg-light-pattern dark:bg-dark-pattern">
      <div className="absolute top-2 right-2">
        <ThemeProvider>
          <ThemeSwitcher />
        </ThemeProvider>
      </div>
      <Updater />
      <img src="/icon-192.png" className="w-20 mb-8" alt="Gisto" />

      <h3 className="">{'{ Gisto }'}</h3>

      <p className="mb-8 text-primary">{t('common.slogan')}</p>

      <form onSubmit={handleSubmit}>
        <Card className="w-[85vw] max-w-[450px] overflow-hidden">
          <CardHeader>
            <CardTitle>
              {provider === 'local' ? t('login.getStarted') : t('login.pleaseSignInUsingToken')}
            </CardTitle>
            <CardDescription className="flex items-center gap-2">
              {getTranslation(config.scopeMessage)}{' '}
              {provider !== 'local' && provider !== 'snippet-bin' && (
                <div title={getTranslation(config.createTokenLabel)}>
                  <ExternalLink
                    className="size-4 cursor-pointer"
                    onClick={() => window.open(helpUrl)}
                  />
                </div>
              )}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid w-full items-center gap-4">
              {renderProviderSelection()}
              {renderTokenFields()}
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full">
              {provider === 'local' ? t('login.continue') : t('login.signIn')}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
};
