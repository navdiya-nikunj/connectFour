import { StreakStats } from '@/types/game';

export function calculateWinRate(wins: number, totalGames: number): number {
  if (totalGames === 0) return 0;
  return Math.round((wins / totalGames) * 100);
}

export function getStreakColor(currentStreak: number): string {
  if (currentStreak >= 10) return 'from-red-500 to-orange-500';
  if (currentStreak >= 5) return 'from-orange-500 to-yellow-500';
  if (currentStreak >= 3) return 'from-yellow-500 to-green-500';
  return 'from-blue-500 to-purple-500';
}

export function getStreakIcon(currentStreak: number): string {
  if (currentStreak >= 10) return '👑';
  if (currentStreak >= 5) return '🏆';
  if (currentStreak >= 3) return '⭐';
  return '🔥';
}

export function getStreakMessage(currentStreak: number): string {
  if (currentStreak >= 10) return "🔥 UNSTOPPABLE! 🔥";
  if (currentStreak >= 5) return "⚡ On Fire! ⚡";
  if (currentStreak >= 3) return "🚀 Rising Star! 🚀";
  return "🎯 Getting Started! 🎯";
}

export function formatDate(date: Date | null): string {
  if (!date) return 'Never';
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
}

export function getAchievementProgress(streak: StreakStats) {
  return [
    {
      name: 'First Win',
      requirement: 1,
      current: streak.totalWins,
      icon: '🔥',
      completed: streak.totalWins >= 1
    },
    {
      name: 'Streak Master',
      requirement: 3,
      current: streak.currentStreak,
      icon: '⭐',
      completed: streak.currentStreak >= 3
    },
    {
      name: 'Fire Starter',
      requirement: 5,
      current: streak.currentStreak,
      icon: '🏆',
      completed: streak.currentStreak >= 5
    },
    {
      name: 'Unstoppable',
      requirement: 10,
      current: streak.currentStreak,
      icon: '👑',
      completed: streak.currentStreak >= 10
    }
  ];
}

export function getStreakEmoji(currentStreak: number): string {
  if (currentStreak >= 10) return '🔥🔥🔥';
  if (currentStreak >= 5) return '🔥🔥';
  if (currentStreak >= 3) return '🔥';
  return '💪';
}

export function getRankColor(rank: number): string {
  switch (rank) {
    case 1:
      return 'bg-gradient-to-r from-yellow-400 to-orange-400 text-white';
    case 2:
      return 'bg-gradient-to-r from-gray-300 to-gray-400 text-white';
    case 3:
      return 'bg-gradient-to-r from-amber-500 to-yellow-500 text-white';
    default:
      return 'bg-white text-gray-800';
  }
}

export function getRankIcon(rank: number): string {
  switch (rank) {
    case 1:
      return '🥇';
    case 2:
      return '🥈';
    case 3:
      return '🥉';
    default:
      return '🏅';
  }
}
