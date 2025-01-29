import { AnimatePresence, motion } from 'motion/react';
import { useState } from 'react';

import { Editor } from '@/components/layout/pages/snippet/content/editor.tsx';
import { Header } from '@/components/layout/pages/snippet/content/header.tsx';
import { useStoreValue } from '@/lib/store/globalState.ts';
import { GistFileType, GistSingleType } from '@/types/gist.ts';

export const File = ({ file, snippet }: { file: GistFileType; snippet: GistSingleType }) => {
  const settings = useStoreValue('settings');
  const [collapsed, setCollapsed] = useState(settings.filesCollapsedByDefault);
  const [preview, setPreview] = useState(true);

  return (
    <>
      <Header
        preview={preview}
        setPreview={setPreview}
        file={file}
        snippet={snippet}
        collapsed={collapsed}
        setCollapsed={setCollapsed}
      />
      <AnimatePresence initial={false}>
        {!collapsed ? (
          <motion.div
            key="editor-container"
            className="bg-background py-2 px-4 overflow-auto mb-4 font-mono"
            initial={{ opacity: 0, y: -20, height: 0 }}
            animate={{ opacity: 1, height: 'auto', y: 0 }}
            exit={{ opacity: 0, y: -10, height: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          >
            <Editor preview={preview} file={file} snippet={snippet} />
          </motion.div>
        ) : (
          <div className="mb-4" />
        )}
      </AnimatePresence>
    </>
  );
};
