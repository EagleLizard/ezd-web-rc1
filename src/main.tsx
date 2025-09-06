
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './app';

createRoot(document.getElementById('ezd-web-root')).render(
  <StrictMode>
    <App/>
  </StrictMode>
);
