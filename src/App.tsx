import './main.css';

import { useEffect, useState } from 'react';
import { Info } from 'lucide-react';

import { RouterProvider, RouteType } from 'dirty-react-router';

import { Label } from '@/components/ui/label';

import { Gisto } from '@/components/gisto.tsx';
import { ThemeProvider } from '@/components/layout/theme-provider.tsx';
import { TooltipProvider } from '@/components/ui/tooltip.tsx';
import { SnippetContent } from '@/components/pages/snippet/content';
import { About } from '@/components/pages/about.tsx';
import { Settings } from '@/components/pages/settings.tsx';
import { Input } from '@/components/ui/input.tsx';
import { Button } from '@/components/ui/button.tsx';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card.tsx';
import { globalState } from '@/lib/store/globalState.ts';
import { DashBoard } from '@/components/pages/dashboard.tsx';

const routes: RouteType[] = [
  {
    path: '/snippets/:id',
    component: SnippetContent,
  },
  {
    path: '/about',
    component: About,
  },
  {
    path: '/settings',
    component: Settings,
  },
  {
    path: '/',
    component: DashBoard,
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
      <ThemeProvider defaultTheme="system">
        <RouterProvider routes={routes}>
          <TooltipProvider>
            <Gisto />
          </TooltipProvider>
        </RouterProvider>
      </ThemeProvider>
    );
  }

  return (
    <div className="flex flex-col justify-center items-center h-screen bg-secondary">
      <h3 className="mb-8">{'{ Gisto }'}</h3>

      <form onSubmit={handleSubmit}>
        <Card className="w-[350px]">
          <CardHeader>
            <CardTitle>Please sign-in using GitHub token</CardTitle>
            <CardDescription className="flex items-center gap-2">
              Only "gists" scope is needed{' '}
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
            <Button type="submit" variant="ghost" className="w-full">
              Sign-in
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
}

export default App;
