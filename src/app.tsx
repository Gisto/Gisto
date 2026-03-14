import './main.css';

import { useEffect, useState } from 'react';

import { Loading } from '@/components/loading.tsx';
import { Gisto } from '@/components/main/gisto.tsx';
import { Login } from '@/components/main/login.tsx';
import { toast } from '@/components/toast';
import { getProviderConfig, SnippetProviderType } from '@/constants/providers.tsx';
import { t } from '@/lib/i18n';
import { globalState } from '@/lib/store/globalState.ts';

export const App = () => {
  const [token, setToken] = useState<string | null>(null);
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const storedProvider = localStorage.getItem('ACTIVE_PROVIDER') as
    | SnippetProviderType
    | null;
  const activeProvider = storedProvider || globalState.getState().settings.activeSnippetProvider;

  useEffect(() => {
    if (activeProvider === 'local') {
      setIsValid(true);
      setIsLoading(false);
      return;
    }
    const tokenKey = getProviderConfig(activeProvider as SnippetProviderType).tokenKey;
    const storedToken = localStorage.getItem(tokenKey);
    if (storedToken) {
      setToken(storedToken);
      validateToken(storedToken, activeProvider);
    } else {
      setIsLoading(false);
    }
  }, [activeProvider]);

  const validateToken = async (
    tokenToValidate: string,
    provider: Exclude<SnippetProviderType, 'local'>,
    baseUrl?: string
  ) => {
    setIsLoading(true);
    try {
      const currentBaseUrl = baseUrl || globalState.getState().settings.snippetBinBaseUrl;
      const url =
        provider === 'gitlab'
          ? 'https://gitlab.com/api/v4/user'
          : provider === 'snippet-bin'
            ? `${currentBaseUrl}/auth/user`
            : 'https://api.github.com/user';
      const headers: Record<string, string> = {};

      if (provider === 'gitlab') {
        headers['Private-Token'] = tokenToValidate;
      } else if (provider === 'snippet-bin') {
        headers['Authorization'] = `token ${tokenToValidate}`;
      } else {
        headers['Authorization'] = `token ${tokenToValidate}`;
      }

      const response = await fetch(url, { headers });

      if (response.status === 200) {
        const tokenKey = getProviderConfig(provider).tokenKey;
        localStorage.setItem(tokenKey, tokenToValidate);
        const userData = await response.json();
        globalState.setState({
          user: {
            ...userData,
            login: userData.login || userData.username,
            avatar_url: userData.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${userData.login || userData.username || 'Gisto'}`,
          },
          isLoggedIn: true,
        });
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

  const handleTokenSubmit = (
    newToken: string,
    provider: SnippetProviderType,
    snippetBinBaseUrl?: string
  ) => {
    localStorage.setItem('ACTIVE_PROVIDER', provider);

    const updatedSettings = {
      ...globalState.getState().settings,
      activeSnippetProvider: provider,
    };

    if (provider === 'snippet-bin' && snippetBinBaseUrl) {
      updatedSettings.snippetBinBaseUrl = snippetBinBaseUrl;
    }

    globalState.setState({
      settings: updatedSettings,
    });

    if (provider === 'local') {
      globalState.setState({ isLoggedIn: true });
      setIsValid(true);
      return;
    }
    setToken(newToken);
    void validateToken(newToken, provider, snippetBinBaseUrl);
  };

  if (isLoading) {
    return <Loading message={`${t('login.checkingToken')}...`} />;
  }

  if (isValid) {
    return <Gisto />;
  }

  return <Login onTokenSubmit={handleTokenSubmit} token={token} isValid={isValid} />;
};
