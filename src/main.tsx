import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import './main.css';
import { Gisto } from './app.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Gisto />
  </StrictMode>
);
