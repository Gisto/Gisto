import { motion, AnimatePresence } from 'motion/react';

import { useStoreValue } from '@/lib/store/globalState.ts';

export const TotalProgressLoader = () => {
  const isLoading = useStoreValue('isLoading');
  const progress = useStoreValue('loadingProgress');

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 10 }}
          whileHover={{ opacity: 0.6 }}
          transition={{ duration: 0.2 }}
          className="fixed bottom-2 right-2 z-[9999] bg-background/90 backdrop-blur-sm border border-border rounded-lg shadow-lg"
        >
          <div className="flex items-center gap-3 px-4 py-2">
            <div className="w-40 h-2 bg-muted rounded-full overflow-hidden">
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: progress / 100 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
                className="h-full origin-left bg-gradient-to-r from-primary to-primary/80 rounded-full"
              />
            </div>
            <span className="text-xs font-medium text-muted-foreground tabular-nums min-w-[3ch]">
              {progress}%
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
