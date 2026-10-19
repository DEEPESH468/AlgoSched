import { describe, expect, it } from 'vitest';
import { optimizeSchedule, type Job } from './algorithm';

const sample: Job[] = [
  { id: 'J1', name: 'Prototype landing page', deadline: 2, profit: 100 }, { id: 'J2', name: 'Prepare user research', deadline: 1, profit: 80 },
  { id: 'J3', name: 'Build design system', deadline: 2, profit: 60 }, { id: 'J4', name: 'Review analytics', deadline: 1, profit: 40 },
  { id: 'J5', name: 'Write release notes', deadline: 3, profit: 30 }, { id: 'J6', name: 'Audit accessibility', deadline: 3, profit: 25 },
  { id: 'J7', name: 'Update documentation', deadline: 2, profit: 20 }, { id: 'J8', name: 'Ship onboarding flow', deadline: 4, profit: 70 },
];
describe('optimizeSchedule', () => {
  it('schedules each job in a unique slot within its deadline and totals accepted profit', () => {
    const result = optimizeSchedule(sample);
    expect(result.totalProfit).toBe(280);
    expect(result.slots.map(slot => slot.job?.id ?? null)).toEqual(['J2', 'J1', 'J5', 'J8']);
    expect(result.rejected.map(job => job.id)).toEqual(['J3', 'J4', 'J6', 'J7']);
    result.slots.forEach(slot => { if (slot.job) expect(slot.time).toBeLessThanOrEqual(slot.job.deadline); });
  });
  it('handles empty, single, deadline-one, and equal-profit inputs stably', () => {
    expect(optimizeSchedule([]).totalProfit).toBe(0);
    expect(optimizeSchedule([{ id: 'a', name: 'A', deadline: 1, profit: 5 }]).accepted).toHaveLength(1);
    const tied = optimizeSchedule([{ id: 'a', name: 'A', deadline: 1, profit: 7 }, { id: 'b', name: 'B', deadline: 1, profit: 7 }]);
    expect(tied.accepted[0].id).toBe('a');
    expect(tied.rejected[0].id).toBe('b');
  });
  it('caps useful slots to the number of jobs, does not mutate input, and validates', () => {
    const jobs: Job[] = [{ id: 'x', name: 'X', deadline: 999, profit: 3 }, { id: 'y', name: 'Y', deadline: 999, profit: 2 }];
    const before = structuredClone(jobs);
    expect(optimizeSchedule(jobs).slots).toHaveLength(2);
    expect(jobs).toEqual(before);
    expect(() => optimizeSchedule([{ id: 'bad', name: 'Bad', deadline: 0, profit: 1 }])).toThrow();
  });
});
