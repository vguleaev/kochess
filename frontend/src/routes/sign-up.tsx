import { createFileRoute, useNavigate, redirect } from '@tanstack/react-router';
import React, { useState } from 'react';
import { signUp, confirmSignUp, autoSignIn } from '@aws-amplify/auth';
import { Link } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Spinner } from '@/components/ui/spinner';
import { useAuth } from '@/contexts/AuthContext';
import { Field, FieldDescription, FieldGroup, FieldLabel } from '@/components/ui/field';
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from '@/components/ui/input-otp';

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

  const renderLogo = () => {
    return (
      <Link to="/" className="flex items-center justify-center gap-2 self-center font-medium">
        <img src="/kochess-logo-filled.svg" alt="Kochess" className="h-12 w-12" />
        <span className="text-xl font-bold">Kochess</span>
      </Link>
    );
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-sm">
        <div className="flex flex-col gap-6">
          {renderLogo()}
          <Card className="shadow-none ring-0">
            <CardHeader>
              <CardTitle>{step === 'verification' ? 'Verify Your Email' : 'Sign Up'}</CardTitle>
              <CardDescription>
                {step === 'verification'
                  ? `We've sent a verification code to ${email}. Please enter it below.`
                  : 'Create an account to get started'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {step === 'verification' ? (
                <form onSubmit={handleConfirmSignUp}>
                  {error && (
                    <div className="mb-4 p-3 rounded-md bg-destructive/10 text-destructive text-sm">{error}</div>
                  )}
                  <FieldGroup>
                    <Field>
                      <FieldLabel htmlFor="verificationCode">Verification Code</FieldLabel>
                      <div className="flex justify-center py-2">
                        <InputOTP
                          maxLength={6}
                          value={verificationCode}
                          onChange={(value) => {
                            setVerificationCode(value);
                            setVerificationCodeError(null);
                            setError(null);
                          }}
                          disabled={isLoading}>
                          <InputOTPGroup>
                            <InputOTPSlot index={0} />
                            <InputOTPSlot index={1} />
                            <InputOTPSlot index={2} />
                          </InputOTPGroup>
                          <InputOTPSeparator />
                          <InputOTPGroup>
                            <InputOTPSlot index={3} />
                            <InputOTPSlot index={4} />
                            <InputOTPSlot index={5} />
                          </InputOTPGroup>
                        </InputOTP>
                      </div>
                      {verificationCodeError && <p className="text-sm text-destructive">{verificationCodeError}</p>}
                    </Field>
                    <Field>
                      <Button type="submit" disabled={isLoading}>
                        {isLoading ? <Spinner className="mr-2 h-4 w-4" /> : null}
                        Verify Email
                      </Button>
                      <Button type="button" variant="ghost" onClick={() => setStep('signup')} disabled={isLoading}>
                        Back to Sign Up
                      </Button>
                    </Field>
                  </FieldGroup>
                </form>
              ) : (
                <form onSubmit={handleSignUp}>
                  {error && (
                    <div className="mb-4 p-3 rounded-md bg-destructive/10 border border-destructive/20 text-destructive text-sm">
                      {error}
                    </div>
                  )}
                  <FieldGroup>
                    <Field>
                      <FieldLabel htmlFor="fullName">Full Name</FieldLabel>
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
                        required
                      />
                      {fullNameError && <p className="text-sm text-destructive">{fullNameError}</p>}
                    </Field>
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
                        autoComplete="email"
                        required
                      />
                      {emailError && <p className="text-sm text-destructive">{emailError}</p>}
                    </Field>
                    <Field>
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
                        autoComplete="new-password"
                        required
                      />
                      {passwordError && <p className="text-sm text-destructive">{passwordError}</p>}
                    </Field>
                    <Field>
                      <FieldLabel htmlFor="confirmPassword">Confirm Password</FieldLabel>
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
                        required
                      />
                      {confirmPasswordError && <p className="text-sm text-destructive">{confirmPasswordError}</p>}
                    </Field>
                    <Field>
                      <Button type="submit" disabled={isLoading}>
                        {isLoading ? <Spinner className="mr-2 h-4 w-4" /> : null}
                        Sign Up
                      </Button>
                      <FieldDescription className="text-center">
                        Already have an account?{' '}
                        <Link to="/sign-in" className="underline underline-offset-4">
                          Sign in
                        </Link>
                      </FieldDescription>
                    </Field>
                  </FieldGroup>
                </form>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
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
