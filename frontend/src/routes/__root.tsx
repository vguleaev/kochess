import { createRootRouteWithContext, Outlet } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';
import { InstallPrompt } from '@/components/InstallPrompt';
import type { RouterContext } from '@/lib/router';

const RootLayout = () => {
  return (
    <>
      <Outlet />
      <InstallPrompt />
      <TanStackRouterDevtools />
    </>
  );
};

export const Route = createRootRouteWithContext<RouterContext>()({ component: RootLayout });
