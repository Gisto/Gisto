import { SidebarClose, SidebarOpen } from 'lucide-react';
import { Github, GitCommit, Heart, Globe, BookOpen, Bug, Twitter, Scale } from 'lucide-react';

import { version } from '../../../../package.json';

import { PageContent } from '@/components/layout/pages/page-content.tsx';
import { PageHeader } from '@/components/layout/pages/page-header.tsx';
import { Button } from '@/components/ui/button.tsx';
import { t } from '@/lib/i18n';

type Props = {
  isCollapsed?: boolean;
  setIsCollapsed?: (b: boolean) => void;
  params?: Record<string, string>;
};

const LinkButton = ({
  href,
  icon: Icon,
  label,
}: {
  href: string;
  icon: React.ElementType;
  label: string;
}) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="flex items-center gap-2 px-4 py-2 rounded-md bg-secondary hover:bg-accent transition-colors text-sm"
  >
    <Icon className="size-4" />
    {label}
  </a>
);

export const About = ({ isCollapsed = false, setIsCollapsed = () => {} }: Props = {}) => {
  return (
    <div className="h-screen w-full border-r border-collapse">
      <PageHeader>
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={() => setIsCollapsed(!isCollapsed)}>
              {!isCollapsed ? (
                <SidebarClose className="size-4" />
              ) : (
                <SidebarOpen className="size-4" />
              )}
            </Button>

            <div className="line-clamp-1">{t('pages.about.title')}</div>
          </div>
        </div>
      </PageHeader>
      <PageContent>
        <div className="w-full h-[calc(100vh-116px)] overflow-auto">
          <div className="max-w-2xl mx-auto p-8 space-y-8">
            <div className="flex items-center gap-6">
              <img src="/icon-192.png" className="w-20 h-20 rounded-2xl shadow-md" alt="Gisto" />
              <div>
                <h1 className="text-3xl font-bold">Gisto</h1>
                <p className="text-sm text-muted-foreground flex items-center gap-2">
                  <span>v{version}</span>
                  <span>·</span>
                  <span className="flex items-center gap-1 font-mono text-xs">
                    <GitCommit className="size-3" />
                    {__COMMIT_HASH__}
                  </span>
                </p>
              </div>
            </div>

            <div className="space-y-6 text-sm leading-relaxed text-muted-foreground">
              <p>{t('pages.about.aboutParagraph')}</p>
              <p>{t('pages.about.privacyParagraph')}</p>
            </div>

            <div className="flex flex-wrap gap-3">
              <LinkButton href="https://github.com/Gisto/Gisto" icon={Github} label="GitHub" />
              <LinkButton href="https://gisto.org" icon={Globe} label="Website" />
              <LinkButton href="https://twitter.com/gistoapp" icon={Twitter} label="Twitter" />
              <LinkButton
                href="https://github.com/Gisto/Gisto/blob/main/CHANGELOG.md"
                icon={BookOpen}
                label={t('pages.about.changelog')}
              />
              <LinkButton
                href="https://github.com/Gisto/Gisto/issues"
                icon={Bug}
                label={t('pages.about.issues')}
              />
            </div>

            <a
              href="https://github.com/sponsors/Gisto"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 py-3 rounded-lg border border-danger/30 text-danger hover:bg-danger/10 transition-colors"
            >
              <Heart className="size-4" />
              {t('pages.about.sponsor')}
            </a>

            <div className="pt-6 border-t text-center">
              <p className="text-xs text-muted-foreground flex items-center justify-center gap-2">
                <Scale className="size-3" />
                MIT License · © {new Date().getFullYear()} Gisto
              </p>
            </div>
          </div>
        </div>
      </PageContent>
    </div>
  );
};
