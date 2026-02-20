import './main.css';

import { useEffect, useState } from 'react';

import { Loading } from '@/components/loading.tsx';
import { Gisto } from '@/components/main/gisto.tsx';
import { Login } from '@/components/main/login.tsx';
import { toast } from '@/components/toast';
import { t } from '@/lib/i18n';
import { globalState } from '@/lib/store/globalState.ts';

export const App = () => {
  const [token, setToken] = useState<string | null>(null);
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const storedProvider = localStorage.getItem('ACTIVE_PROVIDER') as
    | 'github'
    | 'gitlab'
    | 'local'
    | null;
  const activeProvider = storedProvider || globalState.getState().settings.activeSnippetProvider;

  useEffect(() => {
    if (activeProvider === 'local') {
      setIsValid(true);
      return;
    }
    const tokenKey = activeProvider === 'gitlab' ? 'GITLAB_TOKEN' : 'GITHUB_TOKEN';
    const storedToken = localStorage.getItem(tokenKey);
    if (storedToken) {
      setToken(storedToken);
      validateToken(storedToken, activeProvider);
    }
  }, [activeProvider]);

  const validateToken = async (tokenToValidate: string, provider: 'github' | 'gitlab') => {
    setIsLoading(true);
    try {
      const url =
        provider === 'gitlab' ? 'https://gitlab.com/api/v4/user' : 'https://api.github.com/user';
      const headers: Record<string, string> = {};

      if (provider === 'gitlab') {
        headers['Private-Token'] = tokenToValidate;
      } else {
        headers['Authorization'] = `token ${tokenToValidate}`;
      }

      const response = await fetch(url, { headers });

      if (response.status === 200) {
        const tokenKey = provider === 'gitlab' ? 'GITLAB_TOKEN' : 'GITHUB_TOKEN';
        localStorage.setItem(tokenKey, tokenToValidate);
        globalState.setState({ user: await response.json(), isLoggedIn: true });
        setIsValid(true);
      } else {
        setIsValid(false);
      }
    } catch (error) {
      toast.error({ message: t('login.tokenNotValid') });
      console.error(`Error validating ${provider} token:`, error);
      setIsValid(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTokenSubmit = (newToken: string, provider: 'github' | 'gitlab' | 'local') => {
    localStorage.setItem('ACTIVE_PROVIDER', provider);
    globalState.setState({
      settings: {
        ...globalState.getState().settings,
        activeSnippetProvider: provider,
      },
    });
    if (provider === 'local') {
      setIsValid(true);
      return;
    }
    setToken(newToken);
    void validateToken(newToken, provider);
  };

  if (isLoading) {
    return <Loading message={`${t('login.checkingToken')}...`} />;
  }

  if (isValid) {
    return <Gisto />;
  }

  return <Login onTokenSubmit={handleTokenSubmit} token={token} isValid={isValid} />;
};
