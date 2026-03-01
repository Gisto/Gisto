import { Plus, X, Info } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';

import { ActionType } from './reducer';

import { AllTags } from '@/components/all-tags.tsx';
import { Badge } from '@/components/ui/badge.tsx';
import { Button } from '@/components/ui/button.tsx';
import { ScrollArea } from '@/components/ui/scroll-area.tsx';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip.tsx';
import { t } from '@/lib/i18n';
import { upperCaseFirst } from '@/utils';

type TagsSectionProps = {
  tags: string[];
  dispatch: React.Dispatch<ActionType>;
};

export const TagsSection = ({ tags, dispatch }: TagsSectionProps) => {
  return (
    <div className="flex items-center flex-wrap">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" className="mr-2" size="sm">
            <Plus className="size-3" />
          </Button>
        </SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>{upperCaseFirst(t('common.tags'))}</SheetTitle>
            <SheetDescription>
              <ScrollArea className="h-[calc(100vh-100px)]">
                <AllTags
                  allowCreate
                  onClick={(tag) => dispatch({ type: 'ADD_TAG', payload: tag })}
                />
              </ScrollArea>
            </SheetDescription>
          </SheetHeader>
        </SheetContent>
      </Sheet>
      {tags.length === 0 ? (
        <motion.small initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}>
          {t('pages.new.addTagsHelpText')}
        </motion.small>
      ) : (
        <AnimatePresence>
          {tags.map((tag: string) => (
            <motion.div
              key={tag}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.3, type: 'spring' }}
              style={{ display: 'inline-block' }}
            >
              <Badge className="mr-2 mb-2" variant="primary-outline">
                {tag}{' '}
                <X
                  className="size-3 ml-2 cursor-pointer hover:text-danger"
                  onClick={() => dispatch({ type: 'REMOVE_TAG', payload: tag })}
                />
              </Badge>
            </motion.div>
          ))}
        </AnimatePresence>
      )}
    </div>
  );
};

export const TagsSectionLabel = () => {
  return (
    <label htmlFor="tags" className="text-sm font-medium text-primary flex items-center gap-2">
      {upperCaseFirst(t('common.tags'))} ({t('common.optional').toLowerCase()}){' '}
      <Tooltip>
        <TooltipTrigger>
          <Info className="size-4 stroke-gray-500" />
        </TooltipTrigger>
        <TooltipContent>
          <span
            dangerouslySetInnerHTML={{
              __html: t('pages.new.addTagsTooltipHtml'),
            }}
          />
        </TooltipContent>
      </Tooltip>
    </label>
  );
};
