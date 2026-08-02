
import './main.css';
import { createRoot } from 'react-dom/client';
import { RouterProvider, createRouter } from '@tanstack/react-router';

import { routeTree } from './routeTree.gen';
import { EzdSocket } from './lib/socket/ezd-socket';

const router = createRouter({ routeTree });

// Register the router instance for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

const rootEl = document.getElementById('ezd-web-root');
if(rootEl === null) {
  throw new Error('root element not found');
}

// let ews = EzdSocket.init();

createRoot(rootEl).render(
  <RouterProvider router={router}/>
);
