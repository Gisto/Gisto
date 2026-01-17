import { isTauri } from '@/components/isTauri.ts';

export const downloadFile = async (content: string, filename: string) => {
  if (isTauri()) {
    console.log('Using Tauri download method');
    try {
      const { save } = await import('@tauri-apps/plugin-dialog');
      const { writeTextFile } = await import('@tauri-apps/plugin-fs');

      console.log('Modules imported successfully');

      const filePath = await save({
        defaultPath: filename,
      });

      console.log('Selected file path:', filePath);

      if (filePath) {
        await writeTextFile(filePath, content);
        console.log('File saved successfully');
      } else {
        console.log('No file path selected (user cancelled)');
      }
    } catch (error) {
      console.error('Download failed:', error);
      // Show the full error object
      console.error('Error details:', JSON.stringify(error, null, 2));
    }
  } else {
    console.log('Using browser download method');
    const mime = 'text/plain';
    const downloadHref = `data:${mime};charset=utf-8,${encodeURIComponent(content)}`;

    const link = document.createElement('a');
    link.href = downloadHref;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};
