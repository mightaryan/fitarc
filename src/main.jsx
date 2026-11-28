import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';

// Capture Chrome/Android install prompt early so any Install App CTA can trigger it
if (typeof window !== 'undefined') {
  window.__fitarcInstallPrompt = null;
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    window.__fitarcInstallPrompt = e;
    window.dispatchEvent(new CustomEvent('fitarc:pwa-installable'));
  });

  if ('serviceWorker' in navigator && import.meta.env.PROD) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js').catch(() => {});
    });
  } else if ('serviceWorker' in navigator) {
    // Also register in preview/dev when supported on localhost so PWA installability passes checks
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js').catch(() => {});
    });
  }
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
