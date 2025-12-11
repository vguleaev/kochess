import { createFileRoute } from '@tanstack/react-router';
import { SignIn } from '@clerk/clerk-react';

const SignInPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <SignIn routing="hash" signUpUrl="/sign-up" forceRedirectUrl="/" />
    </div>
  );
};

export const Route = createFileRoute('/sign-in')({
  component: SignInPage,
});
