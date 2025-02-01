import { z } from 'zod';

export const FileSchema = z.object({
  filename: z.string().min(1, 'File name is required'),
  content: z.union([z.string().min(1, 'File content is required'), z.null()]),
});

export const SnippetSchema = z.object({
  description: z.string().min(1, 'Description is required'),
  isPublic: z.boolean(),
  files: z.array(FileSchema),
  tags: z.array(z.string()).optional(),
});
