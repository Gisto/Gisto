import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import './main.css';
import { App } from './app.tsx';
import { initI18n } from './lib/i18n';

(async () => {
  await initI18n();

  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <App />
    </StrictMode>
  );
})();
