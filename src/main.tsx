import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import './main.css';
import { App } from './app.tsx';
import { initI18n } from './lib/i18n';

if (import.meta.env.DEV) {
  import('./lib/mock-data').then((mockData) => {
    (
      window as unknown as {
        generateMockData: typeof mockData.generateMockDataWithConfirm;
        clearMockData: typeof mockData.clearMockData;
        getSnippetCount: typeof mockData.getSnippetCount;
      }
    ).generateMockData = mockData.generateMockDataWithConfirm;
    (
      window as unknown as {
        generateMockData: typeof mockData.generateMockDataWithConfirm;
        clearMockData: typeof mockData.clearMockData;
        getSnippetCount: typeof mockData.getSnippetCount;
      }
    ).clearMockData = mockData.clearMockData;
    (
      window as unknown as {
        generateMockData: typeof mockData.generateMockDataWithConfirm;
        clearMockData: typeof mockData.clearMockData;
        getSnippetCount: typeof mockData.getSnippetCount;
      }
    ).getSnippetCount = mockData.getSnippetCount;
    console.log('%cMock Data Tools Available', 'color: #4CAF50; font-weight: bold');
    console.log('  generateMockData(3000) - Generate mock snippets (confirms first)');
    console.log('  clearMockData() - Clear all snippets (confirms first)');
    console.log('  getSnippetCount() - Check snippet count');
  });
}

(async () => {
  await initI18n();

  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <App />
    </StrictMode>
  );
})();
