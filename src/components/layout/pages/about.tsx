import { SidebarClose, SidebarOpen } from 'lucide-react';
import { Heart, GitCommit } from 'lucide-react';

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

const Pipe = () => <div className="inline-block mx-4">|</div>;

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
        <div className="flex justify-center items-center w-full h-[calc(100vh-116px)] text-center">
          <div className="place-items-center m-auto w-full sm:w-1/2  text-center">
            <img src="/icon-192.png" className="w-20 mb-8 mx-auto" alt="Gisto" />
            <p className="mb-8">
              v{version}
              <br />
              <small className="text-xs flex items-center gap-2">
                git <GitCommit /> {__COMMIT_HASH__}
              </small>
            </p>

            <p className="mb-8">{t('pages.about.aboutParagraph')}</p>

            <p className="mb-8">{t('pages.about.privacyParagraph')}</p>

            <a
              target="_blank"
              className="underline hover:underline-offset-4"
              href="https://github.com/sponsors/Gisto"
            >
              <div className="flex items-center gap-2 mx-auto justify-center">
                <Heart className="text-danger size-4" /> {t('pages.about.sponsor')}
              </div>
            </a>
            <br />
            <div className="mb-8">
              <a
                target="_blank"
                className="underline hover:underline-offset-4"
                href="https://github.com/Gisto/Gisto/blob/main/CHANGELOG.md"
              >
                {t('pages.about.changelog')}
              </a>
              <Pipe />
              <a
                target="_blank"
                className="underline hover:underline-offset-4"
                href="https://gisto.org"
              >
                {t('pages.about.website')}
              </a>
              <Pipe />
              <a
                target="_blank"
                className="underline hover:underline-offset-4"
                href="https://github.com/Gisto/Gisto/issues"
              >
                {t('pages.about.issues')}
              </a>
              <Pipe />
              <a
                target="_blank"
                className="underline hover:underline-offset-4"
                href="https://github.com/Gisto/Gisto"
              >
                GitHub
              </a>
              <Pipe />
              <a
                target="_blank"
                className="underline hover:underline-offset-4"
                href="https://twitter.com/gistoapp"
              >
                Twitter
              </a>
            </div>
          </div>
        </div>
      </PageContent>
    </div>
  );
};
