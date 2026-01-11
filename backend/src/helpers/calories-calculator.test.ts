import { describe, it, expect } from 'vitest';
import { calculateDailyCalories } from './calories-calculator';
import { ACTIVITY_LEVEL, GENDER, GOAL } from '@kochess/shared/constants';

describe('calculateDailyCalories', () => {
  const testInput = {
    age: 31,
    height: 172,
    weight: 70,
    sex: GENDER.MALE,
  };

  it('calculates correct calories for SEDENTARY level', () => {
    const result = calculateDailyCalories(
      testInput.age,
      testInput.height,
      testInput.weight,
      testInput.sex,
      ACTIVITY_LEVEL.SEDENTARY,
      GOAL.MAINTAIN
    );
    expect(result).toBe(1950);
  });

  it('calculates correct calories for LIGHT level', () => {
    const result = calculateDailyCalories(
      testInput.age,
      testInput.height,
      testInput.weight,
      testInput.sex,
      ACTIVITY_LEVEL.LIGHT,
      GOAL.MAINTAIN
    );
    expect(result).toBe(2234);
  });

  it('calculates correct calories for MODERATE level', () => {
    const result = calculateDailyCalories(
      testInput.age,
      testInput.height,
      testInput.weight,
      testInput.sex,
      ACTIVITY_LEVEL.MODERATE,
      GOAL.MAINTAIN
    );
    expect(result).toBe(2519);
  });

  it('calculates correct calories for ACTIVE level', () => {
    const result = calculateDailyCalories(
      testInput.age,
      testInput.height,
      testInput.weight,
      testInput.sex,
      ACTIVITY_LEVEL.ACTIVE,
      GOAL.MAINTAIN
    );
    expect(result).toBe(2803);
  });

  it('calculates correct calories for VERY_ACTIVE level', () => {
    const result = calculateDailyCalories(
      testInput.age,
      testInput.height,
      testInput.weight,
      testInput.sex,
      ACTIVITY_LEVEL.VERY_ACTIVE,
      GOAL.MAINTAIN
    );
    expect(result).toBe(3088);
  });

  it('reduces calories by 20% for LOSE goal', () => {
    const result = calculateDailyCalories(
      testInput.age,
      testInput.height,
      testInput.weight,
      testInput.sex,
      ACTIVITY_LEVEL.SEDENTARY,
      GOAL.LOSE
    );
    expect(result).toBe(1560);
  });

  it('increases calories by 20% for GAIN goal', () => {
    const result = calculateDailyCalories(
      testInput.age,
      testInput.height,
      testInput.weight,
      testInput.sex,
      ACTIVITY_LEVEL.SEDENTARY,
      GOAL.GAIN
    );
    expect(result).toBe(2340);
  });
});
