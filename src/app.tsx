import './main.css';

import { RouterProvider, RouteType } from 'dirty-react-router';
import { Info } from 'lucide-react';
import { lazy, useEffect, useState } from 'react';

import { Gisto } from '@/components/layout/gisto.tsx';
import { ThemeProvider } from '@/components/theme/theme-provider.tsx';
import { ThemeSwitcher } from '@/components/theme/theme-switcher.tsx';
import ToastManager, { toast } from '@/components/toast/toast-manager.tsx';
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
import { Label } from '@/components/ui/label';
import { TooltipProvider } from '@/components/ui/tooltip.tsx';
import { globalState } from '@/lib/store/globalState.ts';

const DashBoardPage = lazy(() =>
  import('@/components/layout/pages/dashboard').then((module) => ({
    default: module.DashBoard,
  }))
);

const SnippetContentPage = lazy(() =>
  import('@/components/layout/pages/snippet').then((module) => ({
    default: module.SnippetContent,
  }))
);

const CreateNewPage = lazy(() =>
  import('@/components/layout/pages/create-new').then((module) => ({
    default: module.CreateNew,
  }))
);

const AboutPage = lazy(() =>
  import('@/components/layout/pages/about').then((module) => ({
    default: module.About,
  }))
);

const SettingsPage = lazy(() =>
  import('@/components/layout/pages/settings/index.tsx').then((module) => ({
    default: module.Settings,
  }))
);

const routes: RouteType[] = [
  {
    path: '/',
    component: DashBoardPage,
  },
  {
    path: '/snippets/:id',
    component: SnippetContentPage,
  },
  {
    path: '/new-snippet',
    component: CreateNewPage,
  },
  {
    path: '/about',
    component: AboutPage,
  },
  {
    path: '/settings',
    component: SettingsPage,
  },
  // {
  //   path: '*',
  //   component: () => <div>404</div>,
  // },
];

function App() {
  const [token, setToken] = useState<string | null>(null);
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [newToken, setNewToken] = useState<string>('');

  useEffect(() => {
    const storedToken = localStorage.getItem('GITHUB_TOKEN');
    if (storedToken) {
      setToken(storedToken);
      validateToken(storedToken);
    }
  }, []);

  const validateToken = async (tokenToValidate: string) => {
    setIsLoading(true);
    try {
      const response = await fetch('https://api.github.com/user', {
        headers: {
          Authorization: `token ${tokenToValidate}`,
        },
      });

      if (response.status === 200) {
        localStorage.setItem('GITHUB_TOKEN', tokenToValidate);
        globalState.setState({ user: await response.json(), isLoggedIn: true });
        setIsValid(response.status === 200);
      }
    } catch (error) {
      toast.error({ message: 'Token not valid' });
      console.error('Error validating GitHub token:', error);
      setIsValid(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newToken) {
      setToken(newToken);
      validateToken(newToken);
      setNewToken('');
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col justify-center items-center h-screen">
        <div>Checking token...</div>
      </div>
    );
  }

  if (isValid) {
    return (
      <ThemeProvider>
        <RouterProvider routes={routes}>
          <TooltipProvider>
            <Gisto />
            <ToastManager />
          </TooltipProvider>
        </RouterProvider>
      </ThemeProvider>
    );
  }

  return (
    <div className="flex flex-col justify-center items-center h-screen bg-secondary bg-light-pattern dark:bg-dark-pattern">
      <div className="absolute top-2 right-2">
        <ThemeProvider>
          <ThemeSwitcher />
        </ThemeProvider>
      </div>
      <img src="/favicon.ico" className="w-20 mb-8" alt="" />
      <h3 className="">{'{ Gisto }'}</h3>

      <p className="mb-8 text-primary">Snippets made awesome</p>

      <form onSubmit={handleSubmit}>
        <Card className="w-[350px]">
          <CardHeader>
            <CardTitle>Please sign-in using GitHub token</CardTitle>
            <CardDescription className="flex items-center gap-2">
              Only "gists" scope is required{' '}
              <div title="Create token at Github">
                <Info
                  className="size-4 cursor-pointer"
                  onClick={() => window.open('https://github.com/settings/tokens')}
                />
              </div>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="token">GitHub token</Label>

                <Input
                  id="token"
                  type="text"
                  value={newToken}
                  onChange={(e) => setNewToken(e.target.value)}
                  placeholder="Enter GitHub token"
                />
                {token !== null && !isValid && (
                  <div className="mb-4 text-xs text-destructive">Token not valid</div>
                )}
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full">
              Sign-in
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
}

export default App;
