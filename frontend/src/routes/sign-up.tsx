import { createFileRoute, useNavigate, redirect } from '@tanstack/react-router';
import { useState } from 'react';
import { signUp, confirmSignUp, getCurrentUser, autoSignIn } from '@aws-amplify/auth';
import { Link } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Spinner } from '@/components/ui/spinner';
import { useAuth } from '@/contexts/AuthContext';

const SignUpPage = () => {
  const navigate = useNavigate();
  const { loadUser } = useAuth();
  const [step, setStep] = useState<'signup' | 'verification'>('signup');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [fullNameError, setFullNameError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [confirmPasswordError, setConfirmPasswordError] = useState<string | null>(null);
  const [verificationCodeError, setVerificationCodeError] = useState<string | null>(null);

  const validateSignUpForm = () => {
    let isValid = true;
    setFullNameError(null);
    setEmailError(null);
    setPasswordError(null);
    setConfirmPasswordError(null);

    if (!fullName.trim()) {
      setFullNameError('Full name is required');
      isValid = false;
    }

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
    } else if (password.length < 8) {
      setPasswordError('Password must be at least 8 characters');
      isValid = false;
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
      setPasswordError('Password must contain uppercase, lowercase, and a number');
      isValid = false;
    }

    if (!confirmPassword) {
      setConfirmPasswordError('Please confirm your password');
      isValid = false;
    } else if (password !== confirmPassword) {
      setConfirmPasswordError('Passwords do not match');
      isValid = false;
    }

    return isValid;
  };

  const validateVerificationForm = () => {
    let isValid = true;
    setVerificationCodeError(null);

    if (!verificationCode.trim()) {
      setVerificationCodeError('Verification code is required');
      isValid = false;
    } else if (verificationCode.trim().length !== 6) {
      setVerificationCodeError('Verification code must be 6 digits');
      isValid = false;
    }

    return isValid;
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!validateSignUpForm()) {
      return;
    }

    setIsLoading(true);

    try {
      await signUp({
        username: email.trim(),
        password,
        options: {
          userAttributes: {
            email: email.trim(),
            name: fullName.trim(),
          },
          autoSignIn: { enabled: true },
        },
      });
      setStep('verification');
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || 'Failed to create account. Please try again.');
      } else {
        setError('Failed to create account. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!validateVerificationForm()) {
      return;
    }

    setIsLoading(true);

    try {
      await confirmSignUp({
        username: email.trim(),
        confirmationCode: verificationCode.trim(),
      });
      await autoSignIn();
      await loadUser();
      navigate({ to: '/' });
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || 'Failed to verify email. Please check your code and try again.');
      } else {
        setError('Failed to verify email. Please check your code and try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (step === 'verification') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Verify Your Email</CardTitle>
            <CardDescription>We've sent a verification code to {email}. Please enter it below.</CardDescription>
          </CardHeader>
          <form onSubmit={handleConfirmSignUp}>
            <CardContent className="space-y-4">
              {error && (
                <div className="p-3 rounded-md bg-destructive/10 border border-destructive/20 text-destructive text-sm">
                  {error}
                </div>
              )}
              <div className="space-y-2">
                <label htmlFor="verificationCode" className="text-sm font-medium">
                  Verification Code
                </label>
                <Input
                  id="verificationCode"
                  type="text"
                  placeholder="000000"
                  value={verificationCode}
                  onChange={(e) => {
                    setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6));
                    setVerificationCodeError(null);
                    setError(null);
                  }}
                  aria-invalid={!!verificationCodeError}
                  disabled={isLoading}
                  autoComplete="one-time-code"
                  maxLength={6}
                  className="text-center text-2xl tracking-widest"
                />
                {verificationCodeError && <p className="text-sm text-destructive">{verificationCodeError}</p>}
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Spinner className="mr-2" />
                    Verifying...
                  </>
                ) : (
                  'Verify Email'
                )}
              </Button>
              <Button
                type="button"
                variant="ghost"
                className="w-full"
                onClick={() => setStep('signup')}
                disabled={isLoading}>
                Back to Sign Up
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Sign Up</CardTitle>
          <CardDescription>Create an account to get started</CardDescription>
        </CardHeader>
        <form onSubmit={handleSignUp}>
          <CardContent className="space-y-4">
            {error && (
              <div className="p-3 rounded-md bg-destructive/10 border border-destructive/20 text-destructive text-sm">
                {error}
              </div>
            )}
            <div className="space-y-2">
              <label htmlFor="fullName" className="text-sm font-medium">
                Full Name
              </label>
              <Input
                id="fullName"
                type="text"
                placeholder="John Doe"
                value={fullName}
                onChange={(e) => {
                  setFullName(e.target.value);
                  setFullNameError(null);
                  setError(null);
                }}
                aria-invalid={!!fullNameError}
                disabled={isLoading}
                autoComplete="name"
              />
              {fullNameError && <p className="text-sm text-destructive">{fullNameError}</p>}
            </div>
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                Email
              </label>
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
            </div>
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium">
                Password
              </label>
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
                autoComplete="new-password"
              />
              {passwordError && <p className="text-sm text-destructive">{passwordError}</p>}
            </div>
            <div className="space-y-2">
              <label htmlFor="confirmPassword" className="text-sm font-medium">
                Confirm Password
              </label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  setConfirmPasswordError(null);
                  setError(null);
                }}
                aria-invalid={!!confirmPasswordError}
                disabled={isLoading}
                autoComplete="new-password"
              />
              {confirmPasswordError && <p className="text-sm text-destructive">{confirmPasswordError}</p>}
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Spinner className="mr-2" />
                  Creating account...
                </>
              ) : (
                'Sign Up'
              )}
            </Button>
            <div className="text-center text-sm text-muted-foreground">
              Already have an account?{' '}
              <Link to="/sign-in" className="text-primary hover:underline underline-offset-4">
                Sign in
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export const Route = createFileRoute('/sign-up')({
  beforeLoad: ({ context }) => {
    if (context.auth.isLoaded && context.auth.isSignedIn) {
      throw redirect({
        to: '/',
      });
    }
  },
  component: SignUpPage,
});
