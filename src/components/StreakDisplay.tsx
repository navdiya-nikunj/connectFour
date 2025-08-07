'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Flame, Trophy, TrendingUp, Target, Calendar, Share2, Crown, Star } from 'lucide-react';
import { StreakStats } from '@/types/game';

interface StreakDisplayProps {
  streak: StreakStats;
  className?: string;
  showShareButton?: boolean;
  onShare?: () => void;
}

export default function StreakDisplay({ 
  streak, 
  className = '',
  showShareButton = false,
  onShare 
}: StreakDisplayProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const getStreakColor = (currentStreak: number) => {
    if (currentStreak >= 10) return 'from-red-500 to-orange-500';
    if (currentStreak >= 5) return 'from-orange-500 to-yellow-500';
    if (currentStreak >= 3) return 'from-yellow-500 to-green-500';
    return 'from-blue-500 to-purple-500';
  };

  const getStreakIcon = (currentStreak: number) => {
    if (currentStreak >= 10) return <Crown className="w-6 h-6" />;
    if (currentStreak >= 5) return <Trophy className="w-6 h-6" />;
    if (currentStreak >= 3) return <Star className="w-6 h-6" />;
    return <Flame className="w-6 h-6" />;
  };

  const formatDate = (date: Date | null) => {
    if (!date) return 'Never';
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden ${className}`}
    >
      {/* Header with streak count */}
      <div className={`bg-gradient-to-r ${getStreakColor(streak.currentStreak)} p-6 text-white relative overflow-hidden`}>
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              {getStreakIcon(streak.currentStreak)}
              <h2 className="text-2xl font-bold">Win Streak</h2>
            </div>
            {showShareButton && onShare && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onShare}
                className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors"
              >
                <Share2 className="w-5 h-5" />
              </motion.button>
            )}
          </div>
          
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-center"
          >
            <div className="text-6xl font-bold mb-2">{streak.currentStreak}</div>
            <p className="text-lg opacity-90">
              {streak.currentStreak === 1 ? 'win' : 'wins'} in a row
            </p>
          </motion.div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="p-6">
        <div className="grid grid-cols-2 gap-4 mb-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl p-4 border border-purple-100"
          >
            <div className="flex items-center space-x-2 mb-2">
              <Trophy className="w-5 h-5 text-purple-600" />
              <span className="text-sm font-medium text-purple-700">Longest Streak</span>
            </div>
            <div className="text-2xl font-bold text-purple-800">{streak.longestStreak}</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 border border-green-100"
          >
            <div className="flex items-center space-x-2 mb-2">
              <Target className="w-5 h-5 text-green-600" />
              <span className="text-sm font-medium text-green-700">Win Rate</span>
            </div>
            <div className="text-2xl font-bold text-green-800">{streak.winRate}%</div>
          </motion.div>
        </div>

        {/* Additional Stats */}
        <div className="space-y-3">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
          >
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-4 h-4 text-blue-600" />
              <span className="text-sm text-gray-600">Total Wins</span>
            </div>
            <span className="font-semibold text-gray-800">{streak.totalWins}</span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
          >
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-orange-600" />
              <span className="text-sm text-gray-600">Last Win</span>
            </div>
            <span className="font-semibold text-gray-800">{formatDate(streak.lastWinDate)}</span>
          </motion.div>

          {streak.streakStartDate && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.7 }}
              className="flex items-center justify-between p-3 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border border-yellow-200"
            >
              <div className="flex items-center space-x-2">
                <Flame className="w-4 h-4 text-orange-600" />
                <span className="text-sm text-orange-700">Streak Started</span>
              </div>
              <span className="font-semibold text-orange-800">{formatDate(streak.streakStartDate)}</span>
            </motion.div>
          )}
        </div>

        {/* Streak Progress Bar */}
        {streak.currentStreak > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="mt-6"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600">Progress to next milestone</span>
              <span className="text-sm text-gray-500">
                {streak.currentStreak >= 10 ? 'Max reached!' : `${10 - streak.currentStreak} more to go`}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${Math.min((streak.currentStreak / 10) * 100, 100)}%` }}
                transition={{ duration: 1, delay: 0.9 }}
                className={`h-2 rounded-full bg-gradient-to-r ${getStreakColor(streak.currentStreak)}`}
              />
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
