
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { EzdApp } from './ezd-app';

createRoot(document.getElementById('ezd-web-root')).render(
  <StrictMode>
    <EzdApp/>
  </StrictMode>
);
