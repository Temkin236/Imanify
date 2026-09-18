import { describe, it, expect } from 'vitest';
import {
  calculateStreakStatus,
  getNextMilestone,
  checkNewMilestones
} from '../utils/streakHelper.js';

describe('StreakHelper', () => {
  it('identifies when user is active today without incrementing streak twice', () => {
    const today = new Date('2026-09-18T10:00:00.000Z');
    const lastActive = '2026-09-18T05:30:00.000Z';

    const status = calculateStreakStatus(24, lastActive, today, []);
    expect(status.currentStreak).toBe(24);
    expect(status.isActiveToday).toBe(true);
    expect(status.newAchievements).toHaveLength(0);
  });

  it('increments streak by 1 when active on consecutive day', () => {
    const yesterday = '2026-09-17T18:00:00.000Z';
    const today = new Date('2026-09-18T18:00:00.000Z');

    const status = calculateStreakStatus(23, yesterday, today, []);
    expect(status.currentStreak).toBe(24);
    expect(status.isActiveToday).toBe(true);
  });

  it('awards milestone achievement when passing milestone threshold', () => {
    const yesterday = '2026-09-17T18:00:00.000Z';
    const today = new Date('2026-09-18T18:00:00.000Z');

    const status = calculateStreakStatus(20, yesterday, today, []);
    expect(status.currentStreak).toBe(21);
    expect(status.newAchievements).toContain('dedicated_servant_21_days');
  });

  it('calculates the next milestone accurately', () => {
    expect(getNextMilestone(5)).toBe(7);
    expect(getNextMilestone(7)).toBe(14);
    expect(getNextMilestone(14)).toBe(21);
    expect(getNextMilestone(24)).toBe(30);
  });

  it('does not award duplicate milestone badges', () => {
    const newBadges = checkNewMilestones(14, [
      'streak_3_days',
      'consistent_worshipper_7_days',
      'steadfast_believer_14_days'
    ]);
    expect(newBadges).toHaveLength(0);
  });
});
