import { BadgeAlert } from 'lucide-react';
import { motion } from 'motion/react';
import { z } from 'zod';

import { formatZodErrors } from '@/lib/utils';

export const ZodError = ({ errors, path }: { errors: z.ZodIssue[]; path: string }) => {
  const error = formatZodErrors(errors)[path];

  if (error) {
    return (
      <motion.div
        className="text-danger text-xs flex items-center gap-2"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <BadgeAlert className="stroke-danger size-4" /> {error}
      </motion.div>
    );
  }

  return null;
};
