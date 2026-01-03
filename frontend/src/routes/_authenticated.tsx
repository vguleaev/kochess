import { createFileRoute, redirect, Outlet } from '@tanstack/react-router';
import { Navbar } from '@/components/Navbar';

export const Route = createFileRoute('/_authenticated')({
  beforeLoad: ({ context, location }) => {
    if (!context.auth.isLoaded) {
      return;
    }

    if (!context.auth.isSignedIn) {
      throw redirect({
        to: '/sign-in',
        search: {
          redirect: location.href,
        },
      });
    }
  },
  component: () => {
    return (
      <>
        <Navbar />
        <Outlet />
      </>
    );
  },
});
