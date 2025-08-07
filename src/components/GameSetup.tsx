'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Users, Bot, Trophy, Settings, Play } from 'lucide-react';
import { AIDifficulty } from '@/utils/aiLogic';

interface GameSetupProps {
  onBack: () => void;
  onStartGame: (gameMode: 'local' | 'ai' | 'multiplayer', aiDifficulty: AIDifficulty) => void;
}

export default function GameSetup({ onBack, onStartGame }: GameSetupProps) {
  const [selectedMode, setSelectedMode] = useState<'local' | 'ai' | 'multiplayer'>('local');
  const [aiDifficulty, setAiDifficulty] = useState<AIDifficulty>('medium');


  const gameModes = [
    {
      id: 'local' as const,
      title: 'Local 2-Player',
      description: 'Play with a friend on the same device',
      icon: <Users className="w-8 h-8" />,
      color: 'bg-green-500'
    },
    {
      id: 'ai' as const,
      title: 'vs AI',
      description: 'Challenge our intelligent AI opponent',
      icon: <Bot className="w-8 h-8" />,
      color: 'bg-blue-500'
    },
    // {
    //   id: 'multiplayer' as const,
    //   title: 'Online Multiplayer',
    //   description: 'Play with Farcaster friends (coming soon)',
    //   icon: <Trophy className="w-8 h-8" />,
    //   color: 'bg-purple-500'
    // }
  ];

  const handleStartGame = () => {
    onStartGame(selectedMode, aiDifficulty);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <button
            onClick={onBack}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            
          </button>
          <h1 className="text-3xl font-bold text-gray-800">Game Setup</h1>
          <div className="w-20"></div> {/* Spacer for centering */}
        </motion.div>

        {/* Farcaster Authentication
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-center mb-8"
        >
          <FarcasterAuth onUserChange={setFarcasterUser} />
        </motion.div> */}

        {/* Game Mode Selection */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
            Choose Game Mode
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {gameModes.map((mode) => (
              <motion.div
                key={mode.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`cursor-pointer rounded-lg p-6 shadow-lg transition-all ${
                  selectedMode === mode.id
                    ? 'bg-white border-2 border-blue-500 shadow-xl'
                    : 'bg-white hover:shadow-xl'
                }`}
                onClick={() => setSelectedMode(mode.id)}
              >
                <div className={`w-16 h-16 rounded-full ${mode.color} text-white flex items-center justify-center mb-4 mx-auto`}>
                  {mode.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2 text-center">
                  {mode.title}
                </h3>
                <p className="text-gray-600 text-center text-sm">
                  {mode.description}
                </p>
                {selectedMode === mode.id && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-6 h-6 bg-blue-500 rounded-full mx-auto mt-4"
                  />
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* AI Difficulty Selection */}
        {selectedMode === 'ai' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-8"
          >
            <h3 className="text-xl font-semibold text-gray-800 mb-4 text-center">
              AI Difficulty
            </h3>
            <div className="flex justify-center space-x-4">
              {(['easy', 'medium', 'hard'] as const).map((difficulty) => (
                <button
                  key={difficulty}
                  onClick={() => setAiDifficulty(difficulty)}
                  className={`px-6 py-3 rounded-lg transition-all capitalize ${
                    aiDifficulty === difficulty
                      ? 'bg-green-500 text-white shadow-md'
                      : 'bg-white text-gray-600 hover:bg-gray-50 shadow-lg'
                  }`}
                >
                  {difficulty}
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Game Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-8"
        >
          <div className="bg-white rounded-lg p-6 shadow-lg max-w-md mx-auto">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Settings className="w-5 h-5 text-gray-600" />
              <h3 className="text-lg font-semibold text-gray-800">Game Settings</h3>
            </div>
            <div className="space-y-3 text-sm text-gray-600">
              <div className="flex justify-between">
                <span>Game Mode:</span>
                <span className="font-medium">{gameModes.find(m => m.id === selectedMode)?.title}</span>
              </div>
              {selectedMode === 'ai' && (
                <div className="flex justify-between">
                  <span>AI Difficulty:</span>
                  <span className="font-medium capitalize">{aiDifficulty}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Board Size:</span>
                <span className="font-medium">7x6 (Classic)</span>
              </div>
              <div className="flex justify-between">
                <span>Win Condition:</span>
                <span className="font-medium">4 in a row</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Start Game Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-center"
        >
          <button
            onClick={handleStartGame}
            className="group bg-blue-500 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-600 transition-all hover:shadow-xl flex items-center space-x-2 mx-auto"
          >
            <Play className="w-6 h-6" />
            <span>Start Game</span>
          </button>
        </motion.div>

        {/* Coming Soon Notice */}
        {selectedMode === 'multiplayer' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-6 text-center"
          >
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 max-w-md mx-auto">
              <p className="text-yellow-800 font-medium">
                🚧 Multiplayer coming soon! 🚧
              </p>
              <p className="text-yellow-600 text-sm mt-1">
                Farcaster integration and real-time multiplayer will be available in the next update.
              </p>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
} 