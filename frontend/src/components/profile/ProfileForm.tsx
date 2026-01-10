import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Spinner } from '@/components/ui/spinner';
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field';
import { profileApi } from '@/lib/api';
import {
  GENDER,
  ACTIVITY_LEVEL,
  GOAL,
  AGE_MIN,
  AGE_MAX,
  HEIGHT_CM_MIN,
  HEIGHT_CM_MAX,
  WEIGHT_KG_MIN,
  WEIGHT_KG_MAX,
} from '@kochess/shared/constants';
import type { Gender, ActivityLevel, Goal, UserProfile } from '@kochess/shared/types';
import { useTranslation } from 'react-i18next';

interface ProfileFormProps {
  initialData?: UserProfile | null;
  onSuccess: () => Promise<void> | void;
  submitLabel: string;
  title?: string;
  description?: string;
  className?: string;
  variant?: 'card' | 'clean';
}

export function ProfileForm({
  initialData,
  onSuccess,
  title,
  description,
  submitLabel,
  className,
  variant = 'card',
}: ProfileFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { t } = useTranslation();

  const [age, setAge] = useState<string>(initialData?.age?.toString() || '');
  const [gender, setGender] = useState<Gender | ''>((initialData?.gender?.toLowerCase() as Gender) || '');
  const [height, setHeight] = useState<string>(initialData?.heightCm?.toString() || '');
  const [weightVal, setWeightVal] = useState<string>(initialData?.weightKg?.toString() || '');
  const [activityLevel, setActivityLevel] = useState<ActivityLevel | ''>(
    (initialData?.activityLevel?.toLowerCase() as ActivityLevel) || ''
  );
  const [goal, setGoal] = useState<Goal | ''>((initialData?.goal?.toLowerCase() as Goal) || '');

  const [ageError, setAgeError] = useState<string | null>(null);
  const [genderError, setGenderError] = useState<string | null>(null);
  const [heightError, setHeightError] = useState<string | null>(null);
  const [weightError, setWeightError] = useState<string | null>(null);
  const [activityLevelError, setActivityLevelError] = useState<string | null>(null);
  const [goalError, setGoalError] = useState<string | null>(null);

  const validateForm = () => {
    let isValid = true;
    setAgeError(null);
    setGenderError(null);
    setHeightError(null);
    setWeightError(null);
    setActivityLevelError(null);
    setGoalError(null);

    const ageNum = parseInt(age);
    if (!age || isNaN(ageNum) || ageNum < AGE_MIN || ageNum > AGE_MAX) {
      setAgeError(`Age must be between ${AGE_MIN} and ${AGE_MAX}`);
      isValid = false;
    }

    if (!gender) {
      setGenderError('Please select a gender');
      isValid = false;
    }

    const heightNum = parseInt(height);
    if (!height || isNaN(heightNum) || heightNum < HEIGHT_CM_MIN || heightNum > HEIGHT_CM_MAX) {
      setHeightError(`Height must be between ${HEIGHT_CM_MIN}cm and ${HEIGHT_CM_MAX}cm`);
      isValid = false;
    }

    const weightNum = parseFloat(weightVal);
    if (!weightVal || isNaN(weightNum) || weightNum < WEIGHT_KG_MIN || weightNum > WEIGHT_KG_MAX) {
      setWeightError(`Weight must be between ${WEIGHT_KG_MIN}kg and ${WEIGHT_KG_MAX}kg`);
      isValid = false;
    }

    if (!activityLevel) {
      setActivityLevelError('Please select an activity level');
      isValid = false;
    }

    if (!goal) {
      setGoalError('Please select a goal');
      isValid = false;
    }

    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    setError(null);

    try {
      await profileApi.upsert({
        age: parseInt(age),
        gender: gender as Gender,
        heightCm: parseInt(height),
        weightKg: parseFloat(weightVal),
        activityLevel: activityLevel as ActivityLevel,
        goal: goal as Goal,
      });

      await onSuccess();
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to save profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const formContent = (
    <form onSubmit={handleSubmit}>
      {error && (
        <div className="mb-4 p-3 rounded-md bg-destructive/10 text-destructive text-sm text-center">{error}</div>
      )}

      <FieldGroup>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-7 gap-x-4">
          <Field>
            <FieldLabel htmlFor="age">{t('nutrition.age')}</FieldLabel>
            <Input
              id="age"
              type="number"
              placeholder="e.g. 25"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              disabled={isLoading}
              required
            />
            {ageError && <p className="text-sm text-destructive">{ageError}</p>}
          </Field>

          <Field>
            <FieldLabel htmlFor="gender">{t('nutrition.gender')}</FieldLabel>
            <Select value={gender} onValueChange={(v) => setGender(v as Gender)} disabled={isLoading}>
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
            {genderError && <p className="text-sm text-destructive">{genderError}</p>}
          </Field>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-7 gap-x-4">
          <Field>
            <FieldLabel htmlFor="height">{t('nutrition.height')}</FieldLabel>
            <Input
              id="height"
              type="number"
              placeholder="e.g. 175"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              disabled={isLoading}
              required
            />
            {heightError && <p className="text-sm text-destructive">{heightError}</p>}
          </Field>

          <Field>
            <FieldLabel htmlFor="weight">{t('nutrition.weight')}</FieldLabel>
            <Input
              id="weight"
              type="number"
              step="0.1"
              placeholder="e.g. 70"
              value={weightVal}
              onChange={(e) => setWeightVal(e.target.value)}
              disabled={isLoading}
              required
            />
            {weightError && <p className="text-sm text-destructive">{weightError}</p>}
          </Field>
        </div>

        <Field>
          <FieldLabel htmlFor="activity">{t('nutrition.activityLevel')}</FieldLabel>
          <Select
            value={activityLevel}
            onValueChange={(v) => setActivityLevel(v as ActivityLevel)}
            disabled={isLoading}>
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
          {activityLevelError && <p className="text-sm text-destructive">{activityLevelError}</p>}
        </Field>

        <Field>
          <FieldLabel htmlFor="goal">{t('nutrition.goal')}</FieldLabel>
          <Select value={goal} onValueChange={(v) => setGoal(v as Goal)} disabled={isLoading}>
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
          {goalError && <p className="text-sm text-destructive">{goalError}</p>}
        </Field>

        <Field className="pt-4">
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? <Spinner className="mr-2 h-4 w-4" /> : null}
            {submitLabel}
          </Button>
        </Field>
      </FieldGroup>
    </form>
  );

  if (variant === 'clean') {
    return <div className={className}>{formContent}</div>;
  }

  return (
    <Card className={`shadow-none ring-0 ${className || ''}`}>
      <CardHeader>
        <CardTitle className="text-2xl text-center">{title}</CardTitle>
        <CardDescription className="text-center">{description}</CardDescription>
      </CardHeader>
      <CardContent>{formContent}</CardContent>
    </Card>
  );
}
