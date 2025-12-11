import { createRootRoute, Link, Outlet } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';
import { SignedIn, SignedOut, UserButton } from '@clerk/clerk-react';
import { InstallPrompt } from '@/components/InstallPrompt';
import '../index.css';

const RootLayout = () => (
  <>
    <div className="p-4 flex items-center justify-between border-b border-border bg-background">
      <div className="flex gap-4">
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
      </div>
      <div className="flex items-center gap-4">
        <SignedOut>
          <Link to="/sign-in" className="text-foreground hover:text-primary transition-colors">
            Sign In
          </Link>
          <Link
            to="/sign-up"
            className="bg-primary text-primary-foreground px-4 py-2 rounded-[var(--radius)] hover:opacity-90 transition-opacity">
            Sign Up
          </Link>
        </SignedOut>
        <SignedIn>
          <UserButton
            afterSignOutUrl="/"
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

export const Route = createRootRoute({ component: RootLayout });
