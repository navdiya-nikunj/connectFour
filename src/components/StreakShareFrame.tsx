'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Crown, Trophy, Star, Flame, Target, TrendingUp } from 'lucide-react';
import { StreakShareData } from '@/types/game';

interface StreakShareFrameProps {
  data: StreakShareData;
  className?: string;
}

export default function StreakShareFrame({ data, className = '' }: StreakShareFrameProps) {
  const getStreakColor = (currentStreak: number) => {
    if (currentStreak >= 10) return 'from-red-500 via-orange-500 to-red-600';
    if (currentStreak >= 5) return 'from-orange-500 via-yellow-500 to-orange-600';
    if (currentStreak >= 3) return 'from-yellow-500 via-green-500 to-yellow-600';
    return 'from-blue-500 via-purple-500 to-blue-600';
  };

  const getStreakIcon = (currentStreak: number) => {
    if (currentStreak >= 10) return <Crown className="w-8 h-8" />;
    if (currentStreak >= 5) return <Trophy className="w-8 h-8" />;
    if (currentStreak >= 3) return <Star className="w-8 h-8" />;
    return <Flame className="w-8 h-8" />;
  };

  const getStreakMessage = (currentStreak: number) => {
    if (currentStreak >= 10) return "🔥 UNSTOPPABLE! 🔥";
    if (currentStreak >= 5) return "⚡ On Fire! ⚡";
    if (currentStreak >= 3) return "🚀 Rising Star! 🚀";
    return "🎯 Getting Started! 🎯";
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className={`relative overflow-hidden rounded-3xl shadow-2xl ${className}`}
      style={{
        width: '1200px',
        height: '630px',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
      }}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/20 to-transparent"></div>
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-gradient-to-tl from-white/10 to-transparent rounded-full -mr-32 -mb-32"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 h-full flex flex-col justify-center items-center p-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-white mb-4">
            Connect Four
          </h1>
          <p className="text-xl text-white/90">
            Win Streak Achievement
          </p>
        </motion.div>

        {/* User Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex items-center space-x-6 mb-8"
        >
          <div className="relative">
            <img
              src={data.avatar || '/default-avatar.png'}
              alt={data.displayName}
              className="w-24 h-24 rounded-full border-4 border-white/30 shadow-lg"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = '/default-avatar.png';
              }}
            />
            <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center">
              <Target className="w-4 h-4 text-white" />
            </div>
          </div>
          <div className="text-white">
            <h2 className="text-3xl font-bold mb-2">{data.displayName}</h2>
            <p className="text-xl opacity-90">@{data.username}</p>
          </div>
        </motion.div>

        {/* Streak Display */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className={`bg-gradient-to-r ${getStreakColor(data.currentStreak)} rounded-2xl p-8 text-white text-center shadow-2xl`}
        >
          <div className="flex items-center justify-center space-x-4 mb-4">
            {getStreakIcon(data.currentStreak)}
            <div>
              <div className="text-7xl font-bold">{data.currentStreak}</div>
              <div className="text-xl opacity-90">
                {data.currentStreak === 1 ? 'win' : 'wins'} in a row
              </div>
            </div>
          </div>
          <div className="text-lg font-semibold">
            {getStreakMessage(data.currentStreak)}
          </div>
        </motion.div>

        {/* Stats Row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex space-x-8 mt-8"
        >
          <div className="text-center text-white">
            <div className="text-3xl font-bold">{data.longestStreak}</div>
            <div className="text-sm opacity-80">Best Streak</div>
          </div>
          <div className="text-center text-white">
            <div className="text-3xl font-bold">{data.totalWins}</div>
            <div className="text-sm opacity-80">Total Wins</div>
          </div>
          <div className="text-center text-white">
            <div className="text-3xl font-bold">{data.winRate}%</div>
            <div className="text-sm opacity-80">Win Rate</div>
          </div>
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="absolute bottom-8 left-8 right-8"
        >
          <div className="flex items-center justify-between text-white/80">
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5" />
              <span className="text-lg">Play Connect Four on Farcaster</span>
            </div>
            <div className="text-right">
              <div className="text-sm">Powered by</div>
              <div className="font-bold">Connect Four Mini App</div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-8 right-8">
        <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center">
          <Trophy className="w-8 h-8 text-white/60" />
        </div>
      </div>
      <div className="absolute bottom-8 right-8">
        <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center">
          <Star className="w-6 h-6 text-white/60" />
        </div>
      </div>
    </motion.div>
  );
}
