import { SidebarClose, SidebarOpen } from 'lucide-react';

import { version } from '../../../../package.json';

import { PageContent } from '@/components/layout/pages/page-content.tsx';
import { PageHeader } from '@/components/layout/pages/page-header.tsx';
import { Button } from '@/components/ui/button.tsx';

type Props = {
  isCollapsed?: boolean;
  setIsCollapsed?: (b: boolean) => void;
  params?: Record<string, string>;
};

export const About = ({ isCollapsed = false, setIsCollapsed = () => {} }: Props = {}) => {
  // TODO: Get releases and check for updates - https://api.github.com/repos/Gisto/Gisto/releases
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

            <div className="line-clamp-1">About</div>
          </div>
        </div>
      </PageHeader>
      <PageContent>
        <div className="flex flex-col h-screen justify-center items-center">
          <div className="place-items-center m-auto w-1/2">
            <img src="/icon-192.png" width="80" alt="" />
            <h2 className="mb-8">About Gisto</h2>
            <p className="mb-8">
              Current version: <strong>v{version}</strong>
            </p>

            <p className="mb-8">
              Gisto is a code snippet manager that runs on GitHub Gists and adds additional features
              such as searching, tagging and sharing gists while including a rich code editor.
            </p>

            <p className="mb-8">
              All your data is stored on GitHub and you can access it from GitHub Gists at any time
              with changes carrying over to Gisto.
            </p>

            <p className="mb-8">
              <a
                target="_blank"
                className="underline hover:underline-offset-4"
                href="https://github.com/Gisto/Gisto/blob/main/CHANGELOG.md"
              >
                Change log
              </a>
              &nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
              <a
                target="_blank"
                className="underline hover:underline-offset-4"
                href="https://gisto.org"
              >
                Website
              </a>
              &nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
              <a
                target="_blank"
                className="underline hover:underline-offset-4"
                href="https://github.com/Gisto/Gisto/issues"
              >
                Issues
              </a>
              &nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
              <a
                target="_blank"
                className="underline hover:underline-offset-4"
                href="https://github.com/Gisto/Gisto"
              >
                GitHub
              </a>
              &nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
              <a
                target="_blank"
                className="underline hover:underline-offset-4"
                href="https://twitter.com/gistoapp"
              >
                Twitter
              </a>
            </p>
          </div>
        </div>
      </PageContent>
    </div>
  );
};
