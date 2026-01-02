import { createRootRouteWithContext, Link, Outlet } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';
import { InstallPrompt } from '@/components/InstallPrompt';
import { UserMenu } from '@/components/UserMenu';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import type { RouterContext } from '@/lib/router';
import '../index.css';

const RootLayout = () => {
  const { isSignedIn, isLoaded } = useAuth();

  return (
    <>
      <div className="p-4 flex items-center justify-between border-b border-border bg-background">
        <div className="flex gap-4">
          {isLoaded && isSignedIn && (
            <>
              <Link
                to="/"
                className="text-foreground hover:text-primary transition-colors [&.active]:text-primary [&.active]:font-bold">
                Home
              </Link>
              <Link
                to="/about"
                className="text-foreground hover:text-primary transition-colors [&.active]:text-primary [&.active]:font-bold">
                About
              </Link>
            </>
          )}
        </div>
        <div className="flex items-center gap-4">
          {isLoaded && !isSignedIn && (
            <>
              <Button variant="ghost" asChild>
                <Link to="/sign-in">Sign In</Link>
              </Button>
              <Button asChild>
                <Link to="/sign-up">Sign Up</Link>
              </Button>
            </>
          )}
          {isLoaded && isSignedIn && <UserMenu />}
        </div>
      </div>
      <Outlet />
      <InstallPrompt />
      <TanStackRouterDevtools />
    </>
  );
};

export const Route = createRootRouteWithContext<RouterContext>()({ component: RootLayout });
