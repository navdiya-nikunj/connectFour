'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Play, Users, Bot, Trophy, ArrowRight, Share } from 'lucide-react';
import Image from 'next/image';
import sdk from '@farcaster/miniapp-sdk';
import FarcasterAuth from './FarcasterAuth';

interface LandingPageProps {
  onStartGame: () => void;
}

export default function LandingPage({ onStartGame }: LandingPageProps) {
  
  const features = [
    {
      icon: <Users className="w-6 h-6" />,
      title: 'Local 2-Player',
      description: 'Play with a friend on the same device'
    },
    {
      icon: <Bot className="w-6 h-6" />,
      title: 'AI Opponent',
      description: 'Challenge AI with three difficulty levels'
    },
    {
      icon: <Trophy className="w-6 h-6" />,
      title: 'Tournaments',
      description: 'Compete in weekly tournaments (coming soon)'
    }
  ];

  const handleShare = () => {
    const gameUrl = window.location.href || 'https://connect-four-hazel.vercel.app';
    const castText = `🎮 Just played Connect Four on Farcaster! Check it out: ${gameUrl}`;
    
    sdk.actions.composeCast({
      text: castText,
      embeds: [gameUrl] 
    });
  };

  const handleAddMiniApp = () => {
    sdk.actions.addMiniApp();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center py-8 px-4">
      <div className="max-w-4xl mx-auto text-center">
        {/* Header */}
        <div className="flex justify-center mb-6">
          <FarcasterAuth onUserChange={() => {
            console.log('user changed');
          }} />
        </div>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="flex justify-center mb-6">
            <Image
              src="/logo.png"
              alt="Connect Four Logo"
              width={120}
              height={120}
              className="rounded-lg shadow-lg"
              priority
            />
          </div>
          <h1 className="text-6xl font-bold text-gray-800 mb-4">
            Connect Four
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            The classic game, reimagined for Farcaster
          </p>
          <div className="w-24 h-1 bg-blue-500 mx-auto rounded-full"></div>
        </motion.div>

        {/* Start Game Button */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
          className="flex flex-col sm:flex-row mb-10 gap-4 justify-center items-center"
        >
          <button
            onClick={onStartGame}
            className="group bg-blue-500 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-600 transition-all hover:shadow-xl flex items-center space-x-2"
          >
            <Play className="w-6 h-6" />
            <span>Start Game</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
          
          <button
            onClick={handleShare}
            className="group bg-purple-500 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-purple-600 transition-all hover:shadow-xl flex items-center space-x-2"
          >
            <Share className="w-6 h-6" />
            <span>Share on Farcaster</span>
          </button>

          <button
            onClick={handleAddMiniApp}
            className="group bg-purple-500 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-purple-600 transition-all hover:shadow-xl flex items-center space-x-2"
          >
            <Share className="w-6 h-6" />
            <span>Add MiniApp</span>
          </button>
        </motion.div>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid md:grid-cols-3 gap-6 mb-12"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              className="bg-white rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow"
            >
              <div className="text-blue-500 mb-4 flex justify-center">
                {feature.icon}
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>

        

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="mt-12 text-gray-500"
        >
          <p className="text-sm">
            Built with ❤️ for the Farcaster community
          </p>
        </motion.div>
      </div>
    </div>
  );
} 