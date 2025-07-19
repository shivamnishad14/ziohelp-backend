// Polyfill for 'global' in browser (for sockjs-client)
(window as any).global = window;

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { Toaster } from 'sonner';
import { NotificationProvider } from './context/notification-context';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <NotificationProvider>
      <App />
      <Toaster position="top-right" richColors />
    </NotificationProvider>
  </React.StrictMode>
); 