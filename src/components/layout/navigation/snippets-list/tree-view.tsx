'use client';

import { useRouter } from 'dirty-react-router';
import { ChevronRight, Folder, FolderOpen, FileCode, Plus } from 'lucide-react';
import { useCallback, useMemo, useState } from 'react';

import { Badge } from '@/components/ui/badge.tsx';
import { Button } from '@/components/ui/button.tsx';
import { EmptyState } from '@/components/ui/empty-state.tsx';
import { ScrollArea } from '@/components/ui/scroll-area.tsx';
import { t } from '@/lib/i18n';
import { useStoreValue } from '@/lib/store/globalState.ts';
import { SnippetEnrichedType } from '@/types/snippet.ts';
import { searchFilter } from '@/utils';

type ViewMode = 'tags' | 'languages';

interface TreeNodeData {
  name: string;
  color?: string;
  count: number;
  snippets: SnippetEnrichedType[];
}

type TreeData = Record<string, TreeNodeData>;

interface TreeNodeProps {
  name: string;
  color?: string;
  count: number;
  snippets: SnippetEnrichedType[];
  depth: number;
  allExpanded: boolean;
}

const TreeNode = ({ name, color, count, snippets, depth, allExpanded }: TreeNodeProps) => {
  const [isOpen, setIsOpen] = useState(allExpanded && depth === 0);
  const [isHovered, setIsHovered] = useState(false);
  const { navigate } = useRouter();

  const handleToggle = useCallback(() => {
    setIsOpen((prev: boolean) => !prev);
  }, []);

  return (
    <div>
      <div
        className={`flex items-center gap-1 px-2 py-1.5 cursor-pointer select-none transition-colors ${
          isHovered ? 'bg-accent' : 'hover:bg-accent/50'
        }`}
        style={{ paddingLeft: `${depth * 12 + 8}px` }}
        onClick={handleToggle}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {count > 0 && (
          <ChevronRight className={`size-3 transition-transform ${isOpen ? 'rotate-90' : ''}`} />
        )}
        {count === 0 && <div className="size-3" />}
        {depth === 0 ? (
          isOpen ? (
            <FolderOpen className="size-4 text-primary" />
          ) : (
            <Folder className="size-4 text-muted-foreground" />
          )
        ) : (
          <div
            className="w-2 h-2 rounded-full border"
            style={{ background: color || 'currentColor' }}
          />
        )}
        <span className="text-sm truncate flex-1">{name}</span>
        <Badge variant="secondary" className="ml-auto text-xs h-5">
          {count}
        </Badge>
      </div>
      {isOpen && (
        <div>
          {snippets.map((snippet) => (
            <div
              key={snippet.id}
              className="flex items-center gap-2 px-3 py-1.5 cursor-pointer hover:bg-accent transition-colors"
              style={{ paddingLeft: `${(depth + 1) * 12 + 20}px` }}
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/snippets/${snippet.id}`);
              }}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              <FileCode className="size-3 text-muted-foreground" />
              <span className="text-sm truncate">{snippet.title || t('common.untitled')}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const SkeletonTree = () => (
  <div className="p-2">
    {[...Array.from({ length: 8 })].map((_, i) => (
      <div key={i} className="flex items-center gap-2 px-2 py-2">
        <div className="size-3 bg-foreground/10 rounded animate-pulse" />
        <div className="h-4 w-24 bg-foreground/10 rounded animate-pulse" />
      </div>
    ))}
  </div>
);

interface TreeViewProps {
  mode: ViewMode;
  allExpanded?: boolean;
}

export const TreeView = ({ mode, allExpanded = false }: TreeViewProps) => {
  const { navigate } = useRouter();
  const allSnippets = useStoreValue('snippets');
  const search = useStoreValue('search');

  const treeData = useMemo(() => {
    if (!allSnippets) return {};

    const filteredSnippets = searchFilter(search, allSnippets);

    if (mode === 'tags') {
      const tagsMap: TreeData = {};

      filteredSnippets.forEach((snippet) => {
        if (!snippet.tags || snippet.tags.length === 0) {
          const untagged = 'Untagged';
          if (!tagsMap[untagged]) {
            tagsMap[untagged] = {
              name: untagged,
              count: 0,
              snippets: [],
            };
          }
          tagsMap[untagged].count++;
          tagsMap[untagged].snippets.push(snippet);
        } else {
          snippet.tags.forEach((tag) => {
            if (!tagsMap[tag]) {
              tagsMap[tag] = {
                name: tag,
                count: 0,
                snippets: [],
              };
            }
            tagsMap[tag].count++;
            tagsMap[tag].snippets.push(snippet);
          });
        }
      });

      return tagsMap;
    } else {
      const languagesMap: TreeData = {};

      filteredSnippets.forEach((snippet) => {
        snippet.languages.forEach((lang) => {
          const langName = lang.name;
          if (!languagesMap[langName]) {
            languagesMap[langName] = {
              name: langName,
              color: lang.color,
              count: 0,
              snippets: [],
            };
          }
          languagesMap[langName].count++;
          languagesMap[langName].snippets.push(snippet);
        });
      });

      return languagesMap;
    }
  }, [allSnippets, search, mode]);

  const sortedKeys = Object.keys(treeData).sort((a, b) => {
    const countA = treeData[a].count;
    const countB = treeData[b].count;
    return countB - countA;
  });

  if (!allSnippets) {
    return <SkeletonTree />;
  }

  return (
    <ScrollArea className="flex-1">
      {sortedKeys.length === 0 ? (
        <EmptyState
          className="min-h-full"
          title={t('list.noSnippets')}
          description={t('list.noSnippetsDescription')}
          action={
            <Button
              className="cursor-pointer"
              variant="outline"
              size="sm"
              onClick={() => navigate('/new-snippet')}
            >
              <Plus className="size-4" />
              {t('common.create')} {t('common.snippet')}
            </Button>
          }
        />
      ) : (
        <div className="py-2">
          {sortedKeys.map((key) => (
            <TreeNode
              key={key}
              name={treeData[key].name}
              color={treeData[key].color}
              count={treeData[key].count}
              snippets={treeData[key].snippets}
              depth={0}
              allExpanded={allExpanded}
            />
          ))}
        </div>
      )}
    </ScrollArea>
  );
};
