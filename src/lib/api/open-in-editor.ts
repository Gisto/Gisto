import { invoke } from '@tauri-apps/api/core';

import { isTauri } from '@/components/isTauri.ts';

export type OpenInEditorFile = {
  filename: string;
  content: string;
};

export const openSnippetInEditor = async (
  snippetId: string,
  files: OpenInEditorFile[],
  command: string
): Promise<string> => {
  if (!isTauri()) {
    throw new Error('Only available in the Gisto desktop app');
  }

  return await invoke<string>('open_in_editor', { files, command, snippetId });
};
