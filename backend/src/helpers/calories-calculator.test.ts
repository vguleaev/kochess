import { describe, it, expect } from 'vitest';
import { calculateDailyCalories } from './calories-calculator';
import { ACTIVITY_LEVEL, GENDER } from '@kochess/shared/constants';

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
      ACTIVITY_LEVEL.SEDENTARY
    );
    expect(result).toBe(1950);
  });

  it('calculates correct calories for LIGHT level', () => {
    const result = calculateDailyCalories(
      testInput.age,
      testInput.height,
      testInput.weight,
      testInput.sex,
      ACTIVITY_LEVEL.LIGHT
    );
    expect(result).toBe(2234);
  });

  it('calculates correct calories for MODERATE level', () => {
    const result = calculateDailyCalories(
      testInput.age,
      testInput.height,
      testInput.weight,
      testInput.sex,
      ACTIVITY_LEVEL.MODERATE
    );
    expect(result).toBe(2519);
  });

  it('calculates correct calories for ACTIVE level', () => {
    const result = calculateDailyCalories(
      testInput.age,
      testInput.height,
      testInput.weight,
      testInput.sex,
      ACTIVITY_LEVEL.ACTIVE
    );
    expect(result).toBe(2803);
  });

  it('calculates correct calories for VERY_ACTIVE level', () => {
    const result = calculateDailyCalories(
      testInput.age,
      testInput.height,
      testInput.weight,
      testInput.sex,
      ACTIVITY_LEVEL.VERY_ACTIVE
    );
    expect(result).toBe(3088);
  });
});
