import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Field, FieldLabel } from '@/components/ui/field';
import { GENDER, ACTIVITY_LEVEL, GOAL } from '@kochess/shared/constants';
import type { ProfileFormValues } from '@/schemas/profile';

export function ProfileFormFields() {
  const {
    register,
    formState: { errors, isSubmitting },
    setValue,
    watch,
  } = useFormContext<ProfileFormValues>();
  const { t } = useTranslation();

  const gender = watch('gender');
  const activityLevel = watch('activityLevel');
  const goal = watch('goal');

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-4">
        <Field>
          <FieldLabel htmlFor="age">{t('nutrition.age')}</FieldLabel>
          <Input
            id="age"
            type="number"
            placeholder="e.g. 25"
            disabled={isSubmitting}
            {...register('age', { valueAsNumber: true })}
          />
          {errors.age && <p className="text-sm text-destructive">{errors.age.message}</p>}
        </Field>

        <Field>
          <FieldLabel htmlFor="gender">{t('nutrition.gender')}</FieldLabel>
          <Select
            value={gender}
            disabled={isSubmitting}
            onValueChange={(v) => setValue('gender', v as ProfileFormValues['gender'], { shouldValidate: true })}>
            <SelectTrigger id="gender">
              <SelectValue placeholder={t('nutrition.selectGender')} />
            </SelectTrigger>
            <SelectContent>
              {Object.values(GENDER).map((g) => (
                <SelectItem key={g} value={g}>
                  {t(`nutrition.genderOptions.${g.toUpperCase()}`)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.gender && <p className="text-sm text-destructive">{errors.gender.message}</p>}
        </Field>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-4">
        <Field>
          <FieldLabel htmlFor="height">{t('nutrition.height')}</FieldLabel>
          <Input
            id="height"
            type="number"
            placeholder="e.g. 175"
            disabled={isSubmitting}
            {...register('heightCm', { valueAsNumber: true })}
          />
          {errors.heightCm && <p className="text-sm text-destructive">{errors.heightCm.message}</p>}
        </Field>

        <Field>
          <FieldLabel htmlFor="weight">{t('nutrition.weight')}</FieldLabel>
          <Input
            id="weight"
            type="number"
            step="0.1"
            placeholder="e.g. 70"
            disabled={isSubmitting}
            {...register('weightKg', { valueAsNumber: true })}
          />
          {errors.weightKg && <p className="text-sm text-destructive">{errors.weightKg.message}</p>}
        </Field>
      </div>

      <Field>
        <FieldLabel htmlFor="activity">{t('nutrition.activityLevel')}</FieldLabel>
        <Select
          value={activityLevel}
          disabled={isSubmitting}
          onValueChange={(v) =>
            setValue('activityLevel', v as ProfileFormValues['activityLevel'], { shouldValidate: true })
          }>
          <SelectTrigger id="activity">
            <SelectValue placeholder="Select activity level" />
          </SelectTrigger>
          <SelectContent>
            {Object.values(ACTIVITY_LEVEL).map((a) => (
              <SelectItem key={a} value={a}>
                {t(`nutrition.activityLevelOptions.${a.toUpperCase()}`)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.activityLevel && <p className="text-sm text-destructive">{errors.activityLevel.message}</p>}
      </Field>

      <Field>
        <FieldLabel htmlFor="goal">{t('nutrition.goal')}</FieldLabel>
        <Select
          value={goal}
          disabled={isSubmitting}
          onValueChange={(v) => setValue('goal', v as ProfileFormValues['goal'], { shouldValidate: true })}>
          <SelectTrigger id="goal">
            <SelectValue placeholder="Select your goal" />
          </SelectTrigger>
          <SelectContent>
            {Object.values(GOAL).map((g) => (
              <SelectItem key={g} value={g}>
                {t(`nutrition.goalOptions.${g.toUpperCase()}`)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.goal && <p className="text-sm text-destructive">{errors.goal.message}</p>}
      </Field>
    </div>
  );
}
