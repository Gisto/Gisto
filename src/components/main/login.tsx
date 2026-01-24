import { Info } from 'lucide-react';
import { useState } from 'react';

import { ThemeProvider } from '@/components/theme/theme-provider.tsx';
import { ThemeSwitcher } from '@/components/theme/theme-switcher.tsx';
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
import { Updater } from '@/components/updater.tsx';
import { t } from '@/lib/i18n';

type LoginProps = {
  onTokenSubmit: (token: string) => void;
  token: string | null;
  isValid: boolean | null;
};

export const Login = ({ onTokenSubmit, token, isValid }: LoginProps) => {
  const [newToken, setNewToken] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newToken) {
      onTokenSubmit(newToken);
      setNewToken('');
    }
  };

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
        <Card className="w-[85vw] max-w-[450px]">
          <CardHeader>
            <CardTitle>{t('login.pleaseSignInUsingToken')}</CardTitle>
            <CardDescription className="flex items-center gap-2">
              {t('login.scopeMessage')}{' '}
              <div title={t('login.createTokenAtGithub')}>
                <Info
                  className="size-4 cursor-pointer"
                  onClick={() =>
                    window.open(
                      'https://github.com/settings/tokens/new?scopes=gist&description=Gisto%20(created%20via%20Gisto%20App)'
                    )
                  }
                />
              </div>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="token">{t('login.githubToken')}</Label>

                <InputPassword
                  id="token"
                  value={newToken}
                  onChange={(e) => setNewToken(e.target.value)}
                  placeholder={t('login.enterGithubToken')}
                />
                {token !== null && !isValid && (
                  <div className="mb-4 text-xs text-destructive">{t('login.tokenNotValid')}</div>
                )}
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full">
              {t('login.signIn')}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
};
