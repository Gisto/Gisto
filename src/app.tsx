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
      toast.error({ message: t('login.tokenNotValid') });
      console.error('Error validating GitHub token:', error);
      setIsValid(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTokenSubmit = (newToken: string) => {
    setToken(newToken);
    void validateToken(newToken);
  };

  if (isLoading) {
    return <Loading message={`${t('login.checkingToken')}...`} />;
  }

  if (isValid) {
    return <Gisto />;
  }

  return <Login onTokenSubmit={handleTokenSubmit} token={token} isValid={isValid} />;
};
