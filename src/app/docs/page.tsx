'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Trophy, Users, Bot, Target, Zap, Crown, Star, Flame, Gamepad2, BarChart3, Share2, Award, TrendingUp } from 'lucide-react';
import Link from 'next/link';

export default function DocsPage() {
  const features = [
    {
      icon: <Users className="w-6 h-6" />,
      title: "Multiple Game Modes",
      description: "Play locally with friends, challenge our AI, or compete online with Farcaster users."
    },
    {
      icon: <Trophy className="w-6 h-6" />,
      title: "Win Streak System",
      description: "Track your consecutive wins and climb the leaderboard with our comprehensive streak tracking."
    },
    {
      icon: <Bot className="w-6 h-6" />,
      title: "AI Opponents",
      description: "Challenge our intelligent AI with three difficulty levels: Easy, Medium, and Hard."
    },
    {
      icon: <Target className="w-6 h-6" />,
      title: "Achievement System",
      description: "Unlock achievements as you progress from your first win to becoming unstoppable."
    },
    {
      icon: <Share2 className="w-6 h-6" />,
      title: "Social Sharing",
      description: "Share your achievements and streaks with the Farcaster community."
    },
    {
      icon: <BarChart3 className="w-6 h-6" />,
      title: "Detailed Analytics",
      description: "Track your win rate, total games, and performance statistics."
    }
  ];

  const achievements = [
    {
      name: "First Win",
      requirement: "1 win",
      icon: "🔥",
      description: "Achieve your first victory"
    },
    {
      name: "Streak Master",
      requirement: "3-win streak",
      icon: "⭐",
      description: "Build a solid winning streak"
    },
    {
      name: "Fire Starter",
      requirement: "5-win streak",
      icon: "🏆",
      description: "Show consistent dominance"
    },
    {
      name: "Unstoppable",
      requirement: "10-win streak",
      icon: "👑",
      description: "Reach legendary status"
    }
  ];

  const streakLevels = [
    {
      level: "Getting Started",
      range: "0-2 wins",
      icon: "💪",
      color: "from-blue-500 to-purple-500"
    },
    {
      level: "Rising Star",
      range: "3-4 wins",
      icon: "⭐",
      color: "from-yellow-500 to-green-500"
    },
    {
      level: "On Fire",
      range: "5-9 wins",
      icon: "🏆",
      color: "from-orange-500 to-yellow-500"
    },
    {
      level: "Unstoppable",
      range: "10+ wins",
      icon: "👑",
      color: "from-red-500 to-orange-500"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <Link
            href="/"
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Game</span>
          </Link>
          <h1 className="text-3xl font-bold text-gray-800">Game Documentation</h1>
          <div className="w-32"></div> {/* Spacer for centering */}
        </motion.div>

        {/* Game Overview */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-12"
        >
          <div className="bg-white rounded-lg p-8 shadow-lg">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
              <Gamepad2 className="w-6 h-6 mr-2" />
              About Connect Four
            </h2>
            <p className="text-gray-600 mb-4">
              Connect Four is a classic strategy game where two players take turns dropping colored discs into a vertical grid. 
              The goal is to be the first to connect four of your colored discs in a row, either horizontally, vertically, or diagonally.
            </p>
            <p className="text-gray-600">
              Our version features modern gameplay with AI opponents, comprehensive streak tracking, and social features for the Farcaster community.
            </p>
          </div>
        </motion.section>

        {/* How to Play */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-12"
        >
          <div className="bg-white rounded-lg p-8 shadow-lg">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">How to Play</h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Basic Rules</h3>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    Players take turns dropping discs into the 7x6 grid
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    Discs fall to the lowest available position in the chosen column
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    Connect 4 discs in a row to win (horizontal, vertical, or diagonal)
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    If the board fills up without a winner, it&apos;s a draw
                  </li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Game Modes</h3>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    <strong>Local 2-Player:</strong> Play with a friend on the same device
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    <strong>vs AI:</strong> Challenge our intelligent AI opponent
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-purple-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    <strong>Online Multiplayer:</strong> Coming soon - play with Farcaster friends
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Features */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-12"
        >
          <div className="bg-white rounded-lg p-8 shadow-lg">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Game Features</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  className="bg-gray-50 rounded-lg p-6 hover:shadow-md transition-shadow"
                >
                  <div className="text-blue-500 mb-3">
                    {feature.icon}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {feature.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Streak System */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-12"
        >
          <div className="bg-white rounded-lg p-8 shadow-lg">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
              <Zap className="w-6 h-6 mr-2" />
              Win Streak System
            </h2>
            
                         <div className="mb-6">
               <h3 className="text-lg font-semibold text-gray-800 mb-3">What is a Win Streak?</h3>
               <p className="text-gray-600 mb-4">
                 A win streak tracks your consecutive victories against AI opponents. Every time you win a game against the AI, your streak increases by 1. 
                 If you lose a game against the AI, your streak resets to 0. The system also tracks your longest streak ever achieved.
               </p>
               <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
                 <div className="flex items-start">
                   <Bot className="w-5 h-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
                   <div>
                     <h4 className="font-semibold text-blue-800 mb-1">AI Games Only</h4>
                     <p className="text-blue-700 text-sm">
                       Streaks are only counted when playing against AI opponents. Local 2-player games do not affect your streak.
                     </p>
                   </div>
                 </div>
               </div>
             </div>

                         <div className="mb-6">
               <h3 className="text-lg font-semibold text-gray-800 mb-3">Streak Levels</h3>
               <p className="text-gray-600 mb-4 text-sm">
                 Progress through these levels by winning consecutive games against AI opponents:
               </p>
               <div className="grid md:grid-cols-2 gap-4">
                 {streakLevels.map((level, index) => (
                   <motion.div
                     key={index}
                     initial={{ opacity: 0, x: -20 }}
                     animate={{ opacity: 1, x: 0 }}
                     transition={{ delay: 0.5 + index * 0.1 }}
                     className={`bg-gradient-to-r ${level.color} rounded-lg p-4 text-white`}
                   >
                     <div className="flex items-center justify-between">
                       <div>
                         <div className="text-2xl mb-1">{level.icon}</div>
                         <h4 className="font-semibold">{level.level}</h4>
                         <p className="text-sm opacity-90">{level.range}</p>
                       </div>
                     </div>
                   </motion.div>
                 ))}
               </div>
             </div>

                         <div className="mb-6">
               <h3 className="text-lg font-semibold text-gray-800 mb-3">Streak Statistics</h3>
               <div className="grid md:grid-cols-2 gap-4">
                 <div className="bg-gray-50 rounded-lg p-4">
                   <h4 className="font-semibold text-gray-800 mb-2">Current Streak</h4>
                   <p className="text-gray-600 text-sm">Your current consecutive wins against AI</p>
                 </div>
                 <div className="bg-gray-50 rounded-lg p-4">
                   <h4 className="font-semibold text-gray-800 mb-2">Longest Streak</h4>
                   <p className="text-gray-600 text-sm">Your highest streak ever achieved against AI</p>
                 </div>
                 <div className="bg-gray-50 rounded-lg p-4">
                   <h4 className="font-semibold text-gray-800 mb-2">Total Wins</h4>
                   <p className="text-gray-600 text-sm">Your total number of victories against AI</p>
                 </div>
                 <div className="bg-gray-50 rounded-lg p-4">
                   <h4 className="font-semibold text-gray-800 mb-2">Win Rate</h4>
                   <p className="text-gray-600 text-sm">Percentage of AI games you&apos;ve won</p>
                 </div>
               </div>
             </div>
          </div>
        </motion.section>

        {/* Achievements */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mb-12"
        >
          <div className="bg-white rounded-lg p-8 shadow-lg">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
              <Award className="w-6 h-6 mr-2" />
              Achievement System
            </h2>
            <p className="text-gray-600 mb-6">
              Unlock achievements as you progress through your Connect Four journey. Each achievement represents a milestone in your gaming career.
            </p>
            
            <div className="grid md:grid-cols-2 gap-6">
              {achievements.map((achievement, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                  className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-200"
                >
                  <div className="flex items-center mb-3">
                    <span className="text-3xl mr-3">{achievement.icon}</span>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">
                        {achievement.name}
                      </h3>
                      <p className="text-sm text-blue-600 font-medium">
                        {achievement.requirement}
                      </p>
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm">
                    {achievement.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Leaderboard */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mb-12"
        >
          <div className="bg-white rounded-lg p-8 shadow-lg">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
              <TrendingUp className="w-6 h-6 mr-2" />
              Leaderboard System
            </h2>
            <p className="text-gray-600 mb-4">
              Compete with other players on the global leaderboard. Rankings are based on multiple metrics to give you different ways to compete.
            </p>
            
            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
                <h3 className="font-semibold text-gray-800 mb-2">Current Streak</h3>
                <p className="text-gray-600 text-sm">Ranked by active win streaks</p>
              </div>
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                <h3 className="font-semibold text-gray-800 mb-2">Longest Streak</h3>
                <p className="text-gray-600 text-sm">Ranked by highest streaks achieved</p>
              </div>
              <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                <h3 className="font-semibold text-gray-800 mb-2">Win Rate</h3>
                <p className="text-gray-600 text-sm">Ranked by win percentage</p>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Tips and Strategies */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="mb-12"
        >
          <div className="bg-white rounded-lg p-8 shadow-lg">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Tips & Strategies</h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Beginner Tips</h3>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    Start in the center columns for more opportunities
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    Look for potential winning combinations
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    Block your opponent&apos;s winning moves
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    Plan multiple moves ahead
                  </li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Advanced Strategies</h3>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    Create multiple threats simultaneously
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    Use the &quot;double threat&quot; strategy
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    Control the center of the board
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    Study common opening patterns
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Call to Action */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="text-center"
        >
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-8 text-white shadow-lg">
            <h2 className="text-2xl font-bold mb-4">Ready to Play?</h2>
            <p className="text-blue-100 mb-6">
              Start your Connect Four journey and build your winning streak today!
            </p>
            <Link
              href="/"
              className="inline-flex items-center space-x-2 bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
            >
              <Gamepad2 className="w-5 h-5" />
              <span>Start Playing</span>
            </Link>
          </div>
        </motion.section>
      </div>
    </div>
  );
}
