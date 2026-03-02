
import './main.css';
import React from 'react';
import { ThemeProvider, createTheme } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
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

const ezdTheme = createTheme({
  colorSchemes: {
    dark: true,
  },
  components: {
    // MuiInputBase: {
    MuiTextField: {
      defaultProps: {
        size: 'small',
      },
      styleOverrides: {
        root: {
          '.MuiInputBase-input': {
            /* half */
            padding: '8.25px 7px',
          },
          '.MuiInputBase-inputSizeSmall': {
            /* half */
            padding: '4.25px 7px',
          }
        }
      }
    }
  },
  // spacing: 0,
});

const rootEl = document.getElementById('ezd-web-root');
if(rootEl === null) {
  throw new Error('root element not found');
}

// let ews = EzdSocket.init();

createRoot(rootEl).render(
  <RouterProvider router={router}/>
);
// createRoot(rootEl).render(
//   <React.StrictMode>
//     {/* <ThemeProvider theme={ezdTheme}>
//       <CssBaseline/> */}
//     <RouterProvider router={router}/>
//     {/* </ThemeProvider> */}
//   </React.StrictMode>
// );
