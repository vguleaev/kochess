import { createRootRouteWithContext, Link, Outlet } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';
import { SignedIn, SignedOut, UserButton } from '@clerk/clerk-react';
import { InstallPrompt } from '@/components/InstallPrompt';
import { Button } from '@/components/ui/button';
import type { RouterContext } from '@/lib/router';
import '../index.css';

const RootLayout = () => {
  return (
    <>
      <div className="p-4 flex items-center justify-between border-b border-border bg-background">
        <div className="flex gap-4">
          <SignedIn>
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
          </SignedIn>
        </div>
        <div className="flex items-center gap-4">
          <SignedOut>
            <Button variant="ghost" asChild>
              <Link to="/sign-in">Sign In</Link>
            </Button>
            <Button asChild>
              <Link to="/sign-up">Sign Up</Link>
            </Button>
          </SignedOut>
          <SignedIn>
            <UserButton
              afterSignOutUrl="/sign-in"
              appearance={{
                elements: {
                  avatarBox: 'w-9 h-9',
                },
              }}
            />
          </SignedIn>
        </div>
      </div>
      <Outlet />
      <InstallPrompt />
      <TanStackRouterDevtools />
    </>
  );
};

export const Route = createRootRouteWithContext<RouterContext>()({ component: RootLayout });
