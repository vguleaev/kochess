import { z } from 'zod';
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

export const profileSchema = z.object({
  age: z.number().min(AGE_MIN).max(AGE_MAX),
  gender: z.nativeEnum(GENDER),
  heightCm: z.number().min(HEIGHT_CM_MIN).max(HEIGHT_CM_MAX),
  weightKg: z.number().min(WEIGHT_KG_MIN).max(WEIGHT_KG_MAX),
  activityLevel: z.nativeEnum(ACTIVITY_LEVEL),
  goal: z.nativeEnum(GOAL),
});

export type ProfileFormValues = z.infer<typeof profileSchema>;
