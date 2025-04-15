import { ChevronsDownUp, ChevronsUpDown, Eye, Code2, FileCode, MoreVertical } from 'lucide-react';

import { Badge } from '@/components/ui/badge.tsx';
import { Button } from '@/components/ui/button.tsx';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu.tsx';
import { t } from '@/lib/i18n';
import { copyToClipboard, previewAvailable, upperCaseFirst } from '@/lib/utils';
import { GistFileType, GistSingleType } from '@/types/gist.ts';

export const Header = ({
  file,
  snippet,
  collapsed,
  setCollapsed,
  preview,
  setPreview,
}: {
  file: GistFileType;
  snippet: GistSingleType;
  collapsed: boolean;
  setCollapsed: (c: boolean) => void;
  preview: boolean;
  setPreview: (p: boolean) => void;
}) => {
  return (
    <div className="flex items-center gap-2 justify-between bg-background py-2 px-4 border-b text-lg">
      <div className="flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreVertical className="h-4 w-4" />
              <span className="sr-only">More</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuItem asChild>
              <a
                className="cursor-pointer"
                href={`${snippet.html_url}#file-${file.filename
                  .replace(/\\|-|\./g, '-')
                  .replace(/--/g, '-')
                  .toLowerCase()}`}
                target="_blank"
              >
                {upperCaseFirst(t('pages.snippet.openOnWeb'))}
              </a>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => copyToClipboard(file.content)}>
              {t('pages.snippet.copyContentToClipboard')}
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <a
                className="cursor-pointer"
                href={`https://carbon.now.sh/${snippet.id}?filename=${file.filename}`}
                target="_blank"
              >
                {t('pages.snippet.openIn')} carbon.now.sh
              </a>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <FileCode className="size-4" />

        {file.filename}
      </div>

      <div className="flex items-center gap-2">
        <Badge variant="primary-outline">{file.language ?? 'Text'}</Badge>
        {previewAvailable(file) && (
          <Button variant="ghost" size="icon" onClick={() => setPreview(!preview)}>
            {preview ? <Code2 className="size-4" /> : <Eye className="size-4" />}
          </Button>
        )}
        <Button variant="ghost" size="icon" onClick={() => setCollapsed(!collapsed)}>
          {collapsed ? (
            <ChevronsUpDown className="size-4" />
          ) : (
            <ChevronsDownUp className="size-4" />
          )}
        </Button>
      </div>
    </div>
  );
};
