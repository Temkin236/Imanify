export interface StreakStatus {
  currentStreak: number;
  isActiveToday: boolean;
  canAdvanceStreak: boolean;
  nextMilestone: number;
  newAchievements: string[];
}

export const STREAK_MILESTONES: Record<number, string> = {
  3: 'streak_3_days',
  7: 'consistent_worshipper_7_days',
  14: 'steadfast_believer_14_days',
  21: 'dedicated_servant_21_days',
  30: 'monthly_devotion_30_days',
  60: 'exemplary_devotion_60_days',
  100: 'century_of_iman_100_days'
};

/**
 * Calculates updated streak status based on user's last active date and current date
 */
export function calculateStreakStatus(
  currentStreak: number,
  lastActiveDateStr: string | null | undefined,
  currentDate: Date = new Date(),
  existingAchievements: string[] = []
): StreakStatus {
  if (!lastActiveDateStr) {
    return {
      currentStreak: 1,
      isActiveToday: true,
      canAdvanceStreak: false,
      nextMilestone: getNextMilestone(1),
      newAchievements: checkNewMilestones(1, existingAchievements)
    };
  }

  const lastActive = new Date(lastActiveDateStr);

  const lastDateKey = `${lastActive.getUTCFullYear()}-${String(lastActive.getUTCMonth() + 1).padStart(2, '0')}-${String(lastActive.getUTCDate()).padStart(2, '0')}`;
  const currentDateKey = `${currentDate.getUTCFullYear()}-${String(currentDate.getUTCMonth() + 1).padStart(2, '0')}-${String(currentDate.getUTCDate()).padStart(2, '0')}`;

  if (lastDateKey === currentDateKey) {
    return {
      currentStreak,
      isActiveToday: true,
      canAdvanceStreak: false,
      nextMilestone: getNextMilestone(currentStreak),
      newAchievements: []
    };
  }

  // Calculate day difference in UTC
  const diffTime = Math.abs(currentDate.getTime() - lastActive.getTime());
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  let updatedStreak: number;
  if (diffDays <= 1) {
    updatedStreak = currentStreak + 1;
  } else {
    // Grace period or reset to 1
    updatedStreak = 1;
  }

  const newAchievements = checkNewMilestones(updatedStreak, existingAchievements);

  return {
    currentStreak: updatedStreak,
    isActiveToday: true,
    canAdvanceStreak: false,
    nextMilestone: getNextMilestone(updatedStreak),
    newAchievements
  };
}

export function getNextMilestone(streak: number): number {
  const milestones = Object.keys(STREAK_MILESTONES)
    .map(Number)
    .sort((a, b) => a - b);

  for (const m of milestones) {
    if (m > streak) {
      return m;
    }
  }
  return streak + 10;
}

export function checkNewMilestones(
  streak: number,
  existingAchievements: string[]
): string[] {
  const newBadges: string[] = [];
  const milestones = Object.keys(STREAK_MILESTONES)
    .map(Number)
    .sort((a, b) => a - b);

  for (const m of milestones) {
    if (streak >= m) {
      const badgeKey = STREAK_MILESTONES[m];
      if (!existingAchievements.includes(badgeKey)) {
        newBadges.push(badgeKey);
      }
    }
  }

  return newBadges;
}
