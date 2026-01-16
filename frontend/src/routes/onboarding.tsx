import { createFileRoute, useNavigate, redirect } from '@tanstack/react-router';
import { useAuth } from '@/contexts/AuthContext';
import { ProfileForm } from '@/components/profile/ProfileForm';

import { useTranslation } from 'react-i18next';

const OnboardingPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { loadProfile } = useAuth();

  const handleSuccess = async () => {
    await loadProfile();
    navigate({ to: '/' });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-lg">
        <ProfileForm
          onSuccess={handleSuccess}
          title="Finish account setup"
          description="We just need a few details to complete your profile."
          submitLabel={t('onboarding.continue')}
        />
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
