import { createRouter } from '@tanstack/react-router';
import { useUser } from '@clerk/clerk-react';

import { routeTree } from '@/routeTree.gen';

export type RouterContext = {
  auth: {
    isLoaded: boolean;
    isSignedIn: boolean;
    userId: string | null;
  };
  user: ReturnType<typeof useUser>['user'];
};

export const router = createRouter({
  routeTree,
  context: {
    auth: {
      isLoaded: false,
      isSignedIn: false,
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
