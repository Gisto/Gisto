import { AlertTriangleIcon, ExternalLink, HardDrive } from 'lucide-react';
import { useState } from 'react';

import { GitHubIcon, GitLabIcon } from '@/components/icons';
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
import { InputPassword } from '@/components/ui/inputPassword.tsx';
import { Label } from '@/components/ui/label.tsx';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group.tsx';
import { Updater } from '@/components/updater.tsx';
import { t } from '@/lib/i18n';
import { cn } from '@/utils';

type LoginProps = {
  onTokenSubmit: (token: string, provider: 'github' | 'gitlab' | 'local') => void;
  token: string | null;
  isValid: boolean | null;
};

export const Login = ({ onTokenSubmit, token, isValid }: LoginProps) => {
  const [newToken, setNewToken] = useState<string>('');
  const [provider, setProvider] = useState<'github' | 'gitlab' | 'local'>('github');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (provider === 'local') {
      onTokenSubmit('', 'local');
    } else if (newToken) {
      onTokenSubmit(newToken, provider);
      setNewToken('');
    }
  };

  const helpUrl =
    provider === 'github'
      ? 'https://github.com/settings/tokens/new?scopes=gist&description=Gisto%20(created%20via%20Gisto%20App)'
      : provider === 'gitlab'
        ? 'https://gitlab.com/-/user_settings/personal_access_tokens?name=Gisto&scopes=api'
        : '';

  const showTokenField = provider !== 'local';

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
              {provider === 'local'
                ? t('login.scopeMessageLocal')
                : provider === 'github'
                  ? t('login.scopeMessageGithub')
                  : t('login.scopeMessageGitlab')}{' '}
              {provider !== 'local' && (
                <div
                  title={
                    provider === 'github'
                      ? t('login.createTokenAtGithub')
                      : t('login.createTokenAtGitlab')
                  }
                >
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
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="provider">{t('pages.settings.snippetProvider')}</Label>
                <RadioGroup
                  id="provider"
                  className="grid grid-cols-3 gap-3"
                  onValueChange={(value) => setProvider(value as 'github' | 'gitlab' | 'local')}
                  value={provider}
                >
                  {[
                    { value: 'github', label: t('login.providerGithub') },
                    { value: 'gitlab', label: t('login.providerGitlab') },
                    { value: 'local', label: t('login.providerLocal') },
                  ].map((option) => (
                    <div key={option.value}>
                      <RadioGroupItem
                        value={option.value}
                        id={`provider-${option.value}`}
                        className="peer sr-only"
                        aria-label={option.label}
                      />

                      <Label
                        htmlFor={`provider-${option.value}`}
                        className="cursor-pointer flex items-center justify-center gap-2 rounded-lg border-2 border-muted bg-transparent px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                      >
                        {option.value === 'github' ? (
                          <span className="size-4 text-current" aria-hidden="true">
                            <GitHubIcon />
                          </span>
                        ) : option.value === 'gitlab' ? (
                          <span className="size-4 text-current" aria-hidden="true">
                            <GitLabIcon />
                          </span>
                        ) : (
                          <HardDrive className="size-4" />
                        )}
                        {option.label}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>

                {provider === 'gitlab' && (
                  <Alert className="max-w-md mt-2 border-amber-200 text-amber-900 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-50 animate-in fade-in slide-in-from-top-2 duration-200">
                    <AlertTriangleIcon size="16" />
                    <AlertTitle>{t('login.gitlabWarning')}</AlertTitle>
                    <AlertDescription>{t('login.gitlabWarningDescription')}</AlertDescription>
                  </Alert>
                )}

                {provider === 'local' && (
                  <Alert className="max-w-md mt-2 border-blue-200 text-blue-900 dark:border-blue-900 dark:bg-blue-950 dark:text-blue-50 animate-in fade-in slide-in-from-top-2 duration-200">
                    <AlertTriangleIcon size="16" />
                    <AlertTitle>{t('login.localWarning')}</AlertTitle>
                    <AlertDescription>{t('login.localDescription')}</AlertDescription>
                  </Alert>
                )}
              </div>

              <div
                className={cn(
                  'grid transition-all duration-300 ease-in-out',
                  showTokenField ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                )}
              >
                <div className="overflow-hidden">
                  <div className={cn(!showTokenField && 'hidden')}>
                    <div className="flex flex-col space-y-1.5">
                      <Label htmlFor="token">
                        {provider === 'github' ? t('login.githubToken') : t('login.gitlabToken')}
                      </Label>

                      <InputPassword
                        id="token"
                        value={newToken}
                        onChange={(e) => setNewToken(e.target.value)}
                        placeholder={
                          provider === 'github'
                            ? t('login.enterGithubToken')
                            : t('login.enterGitlabToken')
                        }
                      />
                      {token !== null && !isValid && (
                        <div className="mb-4 text-xs text-destructive">
                          {t('login.tokenNotValid')}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
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
