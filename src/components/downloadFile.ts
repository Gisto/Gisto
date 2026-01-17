import { save } from '@tauri-apps/plugin-dialog';
import { writeTextFile } from '@tauri-apps/plugin-fs';

export const downloadFile = async (content: string, filename: string) => {
  try {
    const filePath = await save({
      defaultPath: filename,
      filters: [
        {
          name: 'Text Files',
          extensions: [],
        },
      ],
    });

    if (filePath) {
      await writeTextFile(filePath, content);
    }
  } catch (error) {
    console.error('Download failed:', error);
  }
};
