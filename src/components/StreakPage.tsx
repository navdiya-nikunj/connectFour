/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Flame, Trophy, Users, Share2, Download, ArrowLeft, RefreshCw, Star } from 'lucide-react';
import StreakDisplay from './StreakDisplay';
import StreakLeaderboard from './StreakLeaderboard';
import StreakShareFrame from './StreakShareFrame';
import { StreakStats, StreakShareData } from '@/types/game';
import { sdk } from '@farcaster/miniapp-sdk';

interface StreakPageProps {
  onBack: () => void;
  className?: string;
}

export default function StreakPage({ onBack, className = '' }: StreakPageProps) {
  const [userStreak, setUserStreak] = useState<StreakStats | null>(null);
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showShareFrame, setShowShareFrame] = useState(false);
  const [activeTab, setActiveTab] = useState<'stats' | 'leaderboard'>('stats');

  useEffect(() => {
    fetchStreakData();
  }, []);

  const fetchStreakData = async () => {
    try {
      setLoading(true);
      
      // Fetch user's streak
      const userResponse = await sdk.quickAuth.fetch('/api/streak');
      if (userResponse.ok) {
        const userData = await userResponse.json();
        setUserStreak(userData.streak);
      }

      // Fetch leaderboard
      const leaderboardResponse = await sdk.quickAuth.fetch('/api/streak?action=leaderboard&limit=10');
      if (leaderboardResponse.ok) {
        const leaderboardData = await leaderboardResponse.json();
        setLeaderboard(leaderboardData.streaks);
      }
    } catch (error) {
      console.error('Error fetching streak data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleShare = () => {
    if (!userStreak) return;
    const gameUrl = window.location.href || "https://connect-four-hazel.vercel.app"
     sdk.actions.composeCast({ 
        text: "Check out my Connect Four streak!",
        embeds: [ `${gameUrl}/api/streak/fid?fid=${userStreak.fid}`],
        channelKey: "farcaster" // optional channel
    });
  };

  const handleShareLink = () => {
    if (!userStreak) return;
    
    const baseUrl = window.location.origin;
    const shareUrl = `${baseUrl}/${userStreak.fid}`;
    
    // Share on Farcaster
    const castText = `🔥 Check out my Connect Four streak! ${shareUrl}`;
    
    sdk.actions.composeCast({
      text: castText,
      embeds: [shareUrl]
    });
  };

  const handleDownloadFrame = () => {
    // This would integrate with a screenshot library like html2canvas
    // For now, we'll just show the frame
    console.log('Download frame functionality would be implemented here');
  };

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center"
      >
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"
          />
          <p className="text-gray-600">Loading streak data...</p>
        </div>
      </motion.div>
    );
  }

  if (showShareFrame && userStreak) {
    const shareData: StreakShareData = {
      fid: userStreak.fid || 0,
      username: userStreak.username || 'user',
      displayName: userStreak.displayName || 'Player',
      avatar: userStreak.avatar || '',
      currentStreak: userStreak.currentStreak,
      longestStreak: userStreak.longestStreak,
      totalWins: userStreak.totalWins,
      winRate: userStreak.winRate
    };

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen bg-gray-900 flex items-center justify-center p-4"
      >
        <div className="relative">
          <StreakShareFrame data={shareData} />
          
          {/* Controls */}
          <div className="absolute top-4 left-4 flex space-x-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowShareFrame(false)}
              className="p-3 bg-white/20 rounded-full text-white hover:bg-white/30 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleDownloadFrame}
              className="p-3 bg-white/20 rounded-full text-white hover:bg-white/30 transition-colors"
            >
              <Download className="w-5 h-5" />
            </motion.button>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4 ${className}`}
    >
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div className="flex items-center space-x-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onBack}
              className="p-3 bg-white rounded-full shadow-lg hover:shadow-xl transition-shadow"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </motion.button>
            <div>
              <h1 className="text-4xl font-bold text-gray-800">Streak Dashboard</h1>
              <p className="text-gray-600">Track your Connect Four achievements</p>
            </div>
          </div>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={fetchStreakData}
            className="p-3 bg-white rounded-full shadow-lg hover:shadow-xl transition-shadow"
          >
            <RefreshCw className="w-5 h-5 text-gray-600" />
          </motion.button>
        </motion.div>

        {/* Tab Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-center mb-8"
        >
          <div className="bg-white rounded-lg p-2 shadow-lg">
            <div className="flex space-x-2">
              {[
                { id: 'stats', label: 'My Stats', icon: Flame },
                { id: 'leaderboard', label: 'Leaderboard', icon: Trophy }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as 'stats' | 'leaderboard')}
                  className={`flex items-center space-x-2 px-6 py-3 rounded-md transition-all ${
                    activeTab === tab.id
                      ? 'bg-blue-500 text-white shadow-md'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <tab.icon className="w-5 h-5" />
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Content */}
        <AnimatePresence mode="wait">
          {activeTab === 'stats' ? (
            <motion.div
              key="stats"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-8"
            >
              {/* User Streak */}
              <div>
                <StreakDisplay
                  streak={userStreak || {
                    fid: 0,
                    currentStreak: 0,
                    longestStreak: 0,
                    totalWins: 0,
                    totalGames: 0,
                    winRate: 0,
                    lastWinDate: null,
                    streakStartDate: null
                  }}
                  showShareButton={true}
                  onShare={handleShare}
                />
              </div>

              {/* Quick Stats */}
              <div className="space-y-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="bg-white rounded-2xl p-6 shadow-xl border border-gray-100"
                >
                  <h3 className="text-xl font-bold text-gray-800 mb-4">Achievement Progress</h3>
                  <div className="space-y-4">
                    {[
                      { name: 'First Win', requirement: 1, current: userStreak?.totalWins || 0, icon: Flame },
                      { name: 'Streak Master', requirement: 3, current: userStreak?.currentStreak || 0, icon: Star },
                      { name: 'Fire Starter', requirement: 5, current: userStreak?.currentStreak || 0, icon: Trophy },
                      { name: 'Unstoppable', requirement: 10, current: userStreak?.currentStreak || 0, icon: Trophy }
                    ].map((achievement, index) => (
                      <div key={achievement.name} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <achievement.icon className="w-4 h-4 text-blue-600" />
                            <span className="text-sm font-medium text-gray-700">{achievement.name}</span>
                          </div>
                          <span className="text-sm text-gray-500">
                            {achievement.current}/{achievement.requirement}
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${Math.min((achievement.current / achievement.requirement) * 100, 100)}%` }}
                            transition={{ duration: 1, delay: 0.3 + index * 0.1 }}
                            className={`h-2 rounded-full ${
                              achievement.current >= achievement.requirement
                                ? 'bg-gradient-to-r from-green-500 to-emerald-500'
                                : 'bg-gradient-to-r from-blue-500 to-purple-500'
                            }`}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  className="bg-white rounded-2xl p-6 shadow-xl border border-gray-100"
                >
                  <h3 className="text-xl font-bold text-gray-800 mb-4">Share Your Streak</h3>
                  <p className="text-gray-600 mb-4">
                    Show off your Connect Four skills to the Farcaster community!
                  </p>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleShare}
                    className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 px-6 rounded-lg font-semibold hover:shadow-lg transition-shadow flex items-center justify-center space-x-2"
                  >
                    <Share2 className="w-5 h-5" />
                    <span>Create Share Frame</span>
                  </motion.button>
                </motion.div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="leaderboard"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              <StreakLeaderboard entries={leaderboard} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
