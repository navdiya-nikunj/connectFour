'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Crown, Trophy, Medal, Star, TrendingUp, Target } from 'lucide-react';

interface LeaderboardEntry {
  fid: number;
  username: string;
  displayName: string;
  avatar: string;
  currentStreak: number;
  longestStreak: number;
  totalWins: number;
  totalGames: number;
  winRate: number;
}

interface StreakLeaderboardProps {
  entries: LeaderboardEntry[];
  className?: string;
}

export default function StreakLeaderboard({ entries, className = '' }: StreakLeaderboardProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="w-5 h-5 text-yellow-500" />;
      case 2:
        return <Trophy className="w-5 h-5 text-gray-400" />;
      case 3:
        return <Medal className="w-5 h-5 text-amber-600" />;
      default:
        return <Star className="w-5 h-5 text-blue-400" />;
    }
  };

  const getRankColor = (rank: number) => {
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
  };

  const getStreakColor = (streak: number) => {
    if (streak >= 10) return 'text-red-600';
    if (streak >= 5) return 'text-orange-600';
    if (streak >= 3) return 'text-yellow-600';
    return 'text-blue-600';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden ${className}`}
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-6 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Trophy className="w-6 h-6" />
            <h2 className="text-2xl font-bold">Streak Leaderboard</h2>
          </div>
          <div className="text-sm opacity-90">Top Players</div>
        </div>
      </div>

      {/* Leaderboard */}
      <div className="p-6">
        <AnimatePresence>
          {entries.map((entry, index) => (
            
            entry.fid > 0 && <motion.div
              key={entry.fid}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`flex items-center space-x-4 p-4 rounded-xl mb-3 border ${
                index < 3 ? 'shadow-lg' : 'shadow-sm'
              } ${getRankColor(index + 1)}`}
            >
              {/* Rank */}
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-white/20">
                {getRankIcon(index + 1)}
              </div>

              {/* Avatar */}
              <div className="flex-shrink-0">
                <img
                  src={entry.avatar || '/default-avatar.png'}
                  alt={entry.displayName}
                  className="w-10 h-10 rounded-full border-2 border-white/50"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = '/default-avatar.png';
                  }}
                />
              </div>

              {/* User Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2">
                  <h3 className="font-semibold truncate">
                    {entry.displayName || entry.username || `User ${entry.fid}`}
                  </h3>
                  {index < 3 && (
                    <span className="text-xs px-2 py-1 rounded-full bg-white/20">
                      #{index + 1}
                    </span>
                  )}
                </div>
                <p className="text-sm opacity-80 truncate">
                  @{entry.username || `user${entry.fid}`}
                </p>
              </div>

              {/* Stats */}
              <div className="flex items-center space-x-4 text-right">
                <div>
                  <div className={`font-bold text-lg ${getStreakColor(entry.currentStreak)}`}>
                    {entry.currentStreak}
                  </div>
                  <div className="text-xs opacity-70">Current</div>
                </div>
                <div>
                  <div className="font-semibold text-sm">
                    {entry.longestStreak}
                  </div>
                  <div className="text-xs opacity-70">Best</div>
                </div>
                <div>
                  <div className="font-semibold text-sm">
                    {entry.winRate}%
                  </div>
                  <div className="text-xs opacity-70">Win Rate</div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Stats Summary */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: entries.length * 0.1 }}
          className="mt-6 p-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl border border-gray-200"
        >
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-blue-600">
                {Math.max(...entries.map(e => e.currentStreak))}
              </div>
              <div className="text-xs text-gray-600">Highest Current Streak</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-600">
                {Math.max(...entries.map(e => e.longestStreak))}
              </div>
              <div className="text-xs text-gray-600">Best Streak Ever</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">
                {Math.round(entries.reduce((sum, e) => sum + e.winRate, 0) / entries.length)}%
              </div>
              <div className="text-xs text-gray-600">Avg Win Rate</div>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
