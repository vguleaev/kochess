import { RouterProvider } from '@tanstack/react-router';
import { QueryClientProvider } from '@tanstack/react-query';
import { useAuth, useUser } from '@clerk/clerk-react';

import { router } from '@/lib/router';
import { queryClient } from '@/lib/query-client';
import { Spinner } from '@/components/ui/spinner';

export function InnerApp() {
  const { isLoaded, isSignedIn, userId } = useAuth();
  const { user } = useUser();

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Spinner className="size-20 text-primary" />
      </div>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider
        router={router}
        context={{
          auth: { isLoaded, isSignedIn: isSignedIn ?? false, userId: userId ?? null },
          user: user ?? null,
        }}
      />
    </QueryClientProvider>
  );
}
