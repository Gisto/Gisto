import { BadgeAlert } from 'lucide-react';
import { z } from 'zod';

import { formatZodErrors } from '@/lib/utils.ts';

export const ZodError = ({ errors, path }: { errors: z.ZodIssue[]; path: string }) => {
  const error = formatZodErrors(errors)[path];

  if (error) {
    return (
      <div className="text-danger text-xs flex items-center gap-2">
        <BadgeAlert className="stroke-danger size-4" /> {error}
      </div>
    );
  }

  return null;
};
