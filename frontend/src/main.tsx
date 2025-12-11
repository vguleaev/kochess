import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider, createRouter } from '@tanstack/react-router';
import { ClerkProvider } from '@clerk/clerk-react';
import { ruRU } from '@clerk/localizations';

import { routeTree } from './routeTree.gen';
import { clerkAppearance } from './lib/clerk-theme';

const CLERK_PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!CLERK_PUBLISHABLE_KEY) {
  throw new Error('Missing VITE_CLERK_PUBLISHABLE_KEY environment variable');
}

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

const rootElement = document.getElementById('root')!;
if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <StrictMode>
      <ClerkProvider publishableKey={CLERK_PUBLISHABLE_KEY} appearance={clerkAppearance} localization={ruRU}>
        <RouterProvider router={router} />
      </ClerkProvider>
    </StrictMode>
  );
}
