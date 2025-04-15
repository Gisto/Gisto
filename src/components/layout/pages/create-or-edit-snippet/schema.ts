import { z } from 'zod';

import { t } from '@/lib/i18n';

export const FileSchema = z.object({
  filename: z.string().min(1, t('pages.new.fileError')),
  content: z.union([z.string().min(1, t('pages.new.fileContentError')), z.null()]),
});

export const SnippetSchema = z.object({
  description: z.string().min(1, t('pages.new.descriptionError')),
  isPublic: z.boolean(),
  files: z.array(FileSchema),
  tags: z.array(z.string()).optional(),
});
