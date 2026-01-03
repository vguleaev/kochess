import { createFileRoute, useNavigate, redirect } from '@tanstack/react-router';
import React, { useState } from 'react';
import { signIn } from '@aws-amplify/auth';
import { Link } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Spinner } from '@/components/ui/spinner';
import { useAuth } from '@/contexts/AuthContext';
import { Field, FieldDescription, FieldGroup, FieldLabel } from '@/components/ui/field';

const LoginForm = () => {
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

  const renderLogo = () => {
    return (
      <Link to="/" className="flex items-center justify-center gap-2 self-center font-medium">
        <img src="/kochess-logo-filled.svg" alt="Kochess" className="h-12 w-12" />
        <span className="text-xl font-bold">Kochess</span>
      </Link>
    );
  };

  return (
    <div className="flex flex-col gap-6">
      {renderLogo()}
      <Card className="shadow-none ring-0">
        <CardHeader>
          <CardTitle>Sign In</CardTitle>
          <CardDescription>Enter your email and password to sign in</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            {error && <div className="mb-4 p-3 rounded-md bg-destructive/10 text-destructive text-sm">{error}</div>}
            <FieldGroup>
              <Field>
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
                  required
                />
                {emailError && <p className="text-sm text-destructive">{emailError}</p>}
              </Field>
              <Field>
                <div className="flex items-center">
                  <FieldLabel htmlFor="password">Password</FieldLabel>
                </div>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setPasswordError(null);
                    setError(null);
                  }}
                  aria-invalid={!!passwordError}
                  disabled={isLoading}
                  required
                />
                {passwordError && <p className="text-sm text-destructive">{passwordError}</p>}
              </Field>
              <Field>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? <Spinner className="mr-2 h-4 w-4" /> : null}
                  Login
                </Button>
                <FieldDescription className="text-center">
                  Don't have an account?{' '}
                  <Link to="/sign-up" className="underline underline-offset-4">
                    Sign up
                  </Link>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

const SignInPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-sm">
        <LoginForm />
      </div>
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
