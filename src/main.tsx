import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { EnhancedSecurityProvider } from '@/components/security/EnhancedSecurityProvider';
import '@/utils/activateLocalMode';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <EnhancedSecurityProvider>
      <App />
    </EnhancedSecurityProvider>
  </React.StrictMode>
);