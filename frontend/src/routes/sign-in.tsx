import { createFileRoute, useNavigate, redirect } from '@tanstack/react-router';
import { useState } from 'react';
import { signIn } from '@aws-amplify/auth';
import { Link } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Spinner } from '@/components/ui/spinner';
import { useAuth } from '@/contexts/AuthContext';
import { Field, FieldDescription, FieldGroup, FieldLabel } from '@/components/ui/field';

const SignInPage = () => {
  const { loadUser } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  const validateForm = () => {
    let isValid = true;
    setEmailError(null);
    setPasswordError(null);

    if (!email.trim()) {
      setEmailError('Email is required');
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError('Please enter a valid email address');
      isValid = false;
    }

    if (!password) {
      setPasswordError('Password is required');
      isValid = false;
    }

    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      await signIn({
        username: email.trim(),
        password,
      });
      await loadUser();
      navigate({ to: '/' });
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || 'Failed to sign in. Please check your credentials.');
      } else {
        setError('Failed to sign in. Please check your credentials.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card>
        <CardHeader>
          <CardTitle>Sign In</CardTitle>
          <CardDescription>Enter your email and password to sign in</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            {error && (
              <div className="p-3 rounded-md bg-destructive/10 border border-destructive/20 text-destructive text-sm">
                {error}
              </div>
            )}
            <FieldGroup>
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setEmailError(null);
                  setError(null);
                }}
                aria-invalid={!!emailError}
                disabled={isLoading}
                autoComplete="email"
              />
              {emailError && <p className="text-sm text-destructive">{emailError}</p>}
            </FieldGroup>
            <FieldGroup>
              <FieldLabel htmlFor="password">Password</FieldLabel>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setPasswordError(null);
                  setError(null);
                }}
                aria-invalid={!!passwordError}
                disabled={isLoading}
                autoComplete="current-password"
              />
              {passwordError && <p className="text-sm text-destructive">{passwordError}</p>}
            </FieldGroup>
            <CardFooter className="flex flex-col gap-4">
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Spinner className="mr-2" />
                    Signing in...
                  </>
                ) : (
                  'Sign In'
                )}
              </Button>
              <div className="text-center text-sm text-muted-foreground">
                Don't have an account?{' '}
                <Link to="/sign-up" className="text-primary hover:underline underline-offset-4">
                  Sign up
                </Link>
              </div>
            </CardFooter>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export const Route = createFileRoute('/sign-in')({
  beforeLoad: ({ context }) => {
    if (context.auth.isLoaded && context.auth.isSignedIn) {
      throw redirect({
        to: '/',
      });
    }
  },
  component: SignInPage,
});
