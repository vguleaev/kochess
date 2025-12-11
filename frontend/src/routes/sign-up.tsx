import { createFileRoute } from '@tanstack/react-router';
import { SignUp } from '@clerk/clerk-react';

const SignUpPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <SignUp routing="hash" signInUrl="/sign-in" forceRedirectUrl="/" />
    </div>
  );
};

export const Route = createFileRoute('/sign-up')({
  component: SignUpPage,
});
