import { motion } from 'motion/react';
import { ReactNode, useState } from 'react';

import { ActionType } from '@/components/layout/pages/create-or-edit-snippet/reducer.ts';
import { t } from '@/lib/i18n';
import { cn } from '@/utils';
import { handleMultipleFilesUpload } from '@/utils/file-upload.ts';

type DropZoneOverlayProps = {
  children: ReactNode;
  dispatch: React.ActionDispatch<[action: ActionType]>;
  defaultLanguage: string;
};

export const DropZoneOverlay = ({ children, dispatch, defaultLanguage }: DropZoneOverlayProps) => {
  const [isDragActive, setIsDragActive] = useState(false);
  const dragCounter = useState(0);

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    // Show overlay on any dragenter event
    setIsDragActive(true);
    dragCounter[1]((prev) => prev + 1);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter[1]((prev) => {
      const newCount = prev - 1;
      if (newCount === 0) {
        setIsDragActive(false);
      }
      return newCount;
    });
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    // Keep overlay visible during drag
    setIsDragActive(true);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
    dragCounter[1](0);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      handleMultipleFilesUpload(files, dispatch, defaultLanguage);
    }
  };

  return (
    <div
      className="relative w-full"
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <div className={isDragActive ? 'blur-xs' : ''}>{children}</div>
      {isDragActive && (
        <motion.div
          className={cn(
            'absolute inset-0 rounded-lg border-2 border-dashed border-primary bg-primary/20 z-20 flex items-center justify-center pointer-events-none'
          )}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <div className="text-center">
            <p className="text-lg font-semibold text-primary">{t('pages.new.dropFilesHere')}</p>
            <p className="text-sm text-muted-foreground">{t('pages.new.supportedFiles')}</p>
          </div>
        </motion.div>
      )}
    </div>
  );
};
