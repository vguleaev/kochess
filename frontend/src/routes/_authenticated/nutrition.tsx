import { createFileRoute } from '@tanstack/react-router';
import { profileApi } from '@/lib/api';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { profileSchema, type ProfileFormValues } from '@/schemas/profile';
import { ProfileFormFields } from '@/components/profile/ProfileFormFields';
import { Spinner } from '@/components/ui/spinner';
import { Flame, Pencil } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useTranslation } from 'react-i18next';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { calculateMacros } from '@/lib/nutrition';
import { useState } from 'react';
import { ResponsiveDialog } from '@/components/ui/responsive-dialog';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export const Route = createFileRoute('/_authenticated/nutrition')({
  component: NutritionPage,
});

function NutritionPage() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [isEditOpen, setIsEditOpen] = useState(false);

  const {
    data: profile,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const { profile } = await profileApi.get();
      return profile;
    },
  });

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    values: profile
      ? {
          age: profile.age,
          gender: profile.gender.toLowerCase() as ProfileFormValues['gender'], // Cast for enum match if needed
          heightCm: profile.heightCm,
          weightKg: profile.weightKg,
          activityLevel: profile.activityLevel.toLowerCase() as ProfileFormValues['activityLevel'],
          goal: profile.goal.toLowerCase() as ProfileFormValues['goal'],
        }
      : undefined,
  });

  const onSubmit = async (data: ProfileFormValues) => {
    try {
      await profileApi.upsert(data);
      await queryClient.invalidateQueries({ queryKey: ['profile'] });
      setIsEditOpen(false);
    } catch (err) {
      console.error(err);
      toast.error('Failed to update profile');
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <Spinner className="w-8 h-8" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-4">
        <div className="p-4 bg-destructive/10 text-destructive rounded-md">
          {error.message || 'Failed to load profile'}
        </div>
      </div>
    );
  }

  const { protein, fats, carbs } = calculateMacros(profile!.dailyCalorieIntake, profile!.weightKg, profile!.goal);

  return (
    <div className="container mx-auto p-4 md:p-6 lg:p-8 max-w-4xl">
      <div className="flex items-center justify-center relative">
        <h1 className="text-xl font-semibold">{t('nutrition.title')}</h1>
      </div>

      <div className="mt-6 gap-0">
        <div className="space-y-6">
          <Card className="bg-gradient-to-br from-primary/25 via-background to-background gap-2">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="space-y-1">
                <CardTitle>{t('nutrition.dailyCalorieTarget')}</CardTitle>
                <CardDescription>{t('nutrition.dailyCalorieTargetDescription')}</CardDescription>
              </div>
              <Flame className="h-9 w-9 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline gap-2 mb-6">
                <span className="text-5xl font-bold text-primary">{Math.round(profile!.dailyCalorieIntake)}</span>
                <span className="text-muted-foreground text-xl">{t('nutrition.kcal')}</span>
              </div>

              <div className="grid grid-cols-3 gap-4 border-t pt-6">
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">
                    {t('nutrition.proteinsPct')}
                  </p>
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-bold text-primary">
                      {protein}
                      {t('nutrition.grammShort')}
                    </span>
                  </div>
                </div>

                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">
                    {t('nutrition.fatsPct')}
                  </p>
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-bold text-primary">
                      {fats}
                      {t('nutrition.grammShort')}
                    </span>
                  </div>
                </div>

                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">
                    {t('nutrition.carbsPct')}
                  </p>
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-bold text-primary">
                      {carbs}
                      {t('nutrition.grammShort')}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="p-4 bg-muted/50 rounded-lg text-sm text-muted-foreground">
            <p>{t('nutrition.dailyCalorieCalculationExplanation')}</p>
          </div>

          <ResponsiveDialog
            open={isEditOpen}
            onOpenChange={setIsEditOpen}
            trigger={
              <Button className="w-full gap-2" size="lg">
                <Pencil className="h-4 w-4" />
                {t('nutrition.editProfile')}
              </Button>
            }
            title={t('nutrition.editProfileDesc')}
            footer={
              <Button
                form="nutrition-form"
                type="submit"
                className="w-full mt-2 md:mt-0"
                disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? <Spinner className="mr-2 h-4 w-4" /> : null}
                {t('common.save')}
              </Button>
            }>
            <FormProvider {...form}>
              <form id="nutrition-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pb-4">
                <ProfileFormFields />
              </form>
            </FormProvider>
          </ResponsiveDialog>
        </div>
      </div>
    </div>
  );
}
