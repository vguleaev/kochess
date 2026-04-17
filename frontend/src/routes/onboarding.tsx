import { createFileRoute, useNavigate, redirect } from '@tanstack/react-router';
import { useAuth } from '@/contexts/auth-context';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { profileSchema, type ProfileFormValues } from '@/schemas/profile';
import { ProfileFormFields } from '@/components/profile/ProfileFormFields';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { profileApi } from '@/lib/api';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';

const OnboardingPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { checkProfile } = useAuth();

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      age: undefined,
      heightCm: undefined,
      weightKg: undefined,
      gender: undefined,
      activityLevel: undefined,
      goal: undefined,
    },
  });

  const onSubmit = async (data: ProfileFormValues) => {
    try {
      await profileApi.upsert(data);
      await checkProfile();
      navigate({ to: '/' });
    } catch (error) {
      console.error('Failed to create profile:', error);
      toast.error('Failed to update profile');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-lg">
        <Card className="shadow-none ring-0">
          <CardHeader>
            <CardTitle className="text-2xl text-center">Finish account setup</CardTitle>
            <CardDescription className="text-center">
              We just need a few details to complete your profile.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <FormProvider {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <ProfileFormFields />

                <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
                  {form.formState.isSubmitting ? <Spinner className="mr-2 h-4 w-4" /> : null}
                  {t('onboarding.continue')}
                </Button>
              </form>
            </FormProvider>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export const Route = createFileRoute('/onboarding')({
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

    if (context.auth.hasProfile) {
      throw redirect({ to: '/' });
    }
  },
  component: OnboardingPage,
});
