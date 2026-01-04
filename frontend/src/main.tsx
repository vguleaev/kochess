import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';

import './index.css';
import '@/lib/amplify-config';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/theme-provider';
import { InnerApp } from './components/InnerApp';

const rootElement = document.getElementById('root')!;
if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <StrictMode>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <AuthProvider>
          <InnerApp />
        </AuthProvider>
      </ThemeProvider>
    </StrictMode>
  );
}
