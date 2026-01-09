import { createRouter } from '@tanstack/react-router';

import { routeTree } from '@/routeTree.gen';
import type { User } from '@/contexts/AuthContext';

export type RouterContext = {
  auth: {
    isLoaded: boolean;
    isSignedIn: boolean;
    hasProfile: boolean;
    userId: string | null;
  };
  user: User | null;
};

export const router = createRouter({
  routeTree,
  context: {
    auth: {
      isLoaded: false,
      isSignedIn: false,
      hasProfile: false,
      userId: null,
    },
    user: null,
  },
});

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}
