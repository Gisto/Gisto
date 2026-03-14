import { AlertTriangleIcon, HardDrive, LucideIcon } from 'lucide-react';
import { ReactNode } from 'react';

import { GitHubIcon, GitLabIcon, SnippetBinIcon } from '@/components/icons';
import { t } from '@/lib/i18n';

export type SnippetProviderType = 'github' | 'gitlab' | 'local' | 'snippet-bin';

export interface ProviderConfig {
  value: SnippetProviderType;
  label: string | (() => string);
  tokenKey: string;
  Icon: LucideIcon | (() => ReactNode);
  helpUrl?: string;
  tokenLabel: string | (() => string);
  tokenPlaceholder: string | (() => string);
  scopeMessage: string | (() => string);
  createTokenLabel?: string | (() => string);
  warning?: {
    title: string | (() => string);
    description: string | (() => string);
    Icon: LucideIcon;
  };
}

export const PROVIDER_CONFIGS: Record<SnippetProviderType, ProviderConfig> = {
  github: {
    value: 'github',
    label: () => t('login.providerGithub'),
    tokenKey: 'GITHUB_TOKEN',
    Icon: GitHubIcon,
    helpUrl: 'https://github.com/settings/tokens/new?scopes=gist&description=Gisto%20(created%20via%20Gisto%20App)',
    tokenLabel: () => t('login.githubToken'),
    tokenPlaceholder: () => t('login.enterGithubToken'),
    scopeMessage: () => t('login.scopeMessageGithub'),
    createTokenLabel: () => t('login.createTokenAtGithub'),
  },
  gitlab: {
    value: 'gitlab',
    label: () => t('login.providerGitlab'),
    tokenKey: 'GITLAB_TOKEN',
    Icon: GitLabIcon,
    helpUrl: 'https://gitlab.com/-/user_settings/personal_access_tokens?name=Gisto&scopes=api',
    tokenLabel: () => t('login.gitlabToken'),
    tokenPlaceholder: () => t('login.enterGitlabToken'),
    scopeMessage: () => t('login.scopeMessageGitlab'),
    createTokenLabel: () => t('login.createTokenAtGitlab'),
    warning: {
      title: () => t('login.gitlabWarning'),
      description: () => t('login.gitlabWarningDescription'),
      Icon: AlertTriangleIcon,
    },
  },
  'snippet-bin': {
    value: 'snippet-bin',
    label: () => t('login.providerSnippetBin'),
    tokenKey: 'SNIPPET_BIN_TOKEN',
    Icon: SnippetBinIcon,
    tokenLabel: () => t('login.snippetBinToken'),
    tokenPlaceholder: () => t('login.enterSnippetBinToken'),
    scopeMessage: () => t('login.scopeMessageSnippetBin'),
  },
  local: {
    value: 'local',
    label: () => t('login.providerLocal'),
    tokenKey: '', // No token for local
    Icon: HardDrive,
    tokenLabel: '',
    tokenPlaceholder: '',
    scopeMessage: () => t('login.scopeMessageLocal'),
    warning: {
      title: () => t('login.localWarning'),
      description: () => t('login.localDescription'),
      Icon: AlertTriangleIcon,
    },
  },
};

export const getTranslation = (value: string | (() => string) | undefined): string => {
  if (!value) return '';
  return typeof value === 'function' ? value() : value;
};

export const getProviderConfig = (provider: SnippetProviderType): ProviderConfig => {
  return PROVIDER_CONFIGS[provider];
};
