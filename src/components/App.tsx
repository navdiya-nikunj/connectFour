'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { sdk } from '@farcaster/miniapp-sdk';
import LandingPage from './LandingPage';
import GameSetup from './GameSetup';
import GameScreen from './GameScreen';
import { AIDifficulty } from '@/utils/aiLogic';

type Screen = 'landing' | 'setup' | 'game';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('landing');
  const [gameMode, setGameMode] = useState<'local' | 'ai' | 'multiplayer'>('local');
  const [aiDifficulty, setAiDifficulty] = useState<AIDifficulty>('medium');
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Initialize the Mini App and hide the splash screen
    const initializeApp = async () => {
      try {
        await sdk.actions.ready();
        setIsReady(true);
      } catch (error) {
        console.error('Failed to initialize Mini App:', error);
        // Still set ready to true to prevent infinite loading
        setIsReady(true);
      }
    };

    initializeApp();
  }, []);

  const handleStartGame = () => {
    setCurrentScreen('setup');
  };

  const handleBackToHome = () => {
    setCurrentScreen('landing');
  };

  const handleBackToSetup = () => {
    setCurrentScreen('setup');
  };

  const handleStartGameFromSetup = (mode: 'local' | 'ai' | 'multiplayer', difficulty: AIDifficulty) => {
    setGameMode(mode);
    setAiDifficulty(difficulty);
    setCurrentScreen('game');
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'landing':
        return <LandingPage onStartGame={handleStartGame} />;
      case 'setup':
        return (
          <GameSetup
            onBack={handleBackToHome}
            onStartGame={handleStartGameFromSetup}
          />
        );
      case 'game':
        return (
          <GameScreen
            gameMode={gameMode}
            aiDifficulty={aiDifficulty}
            onBackToSetup={handleBackToSetup}
            onBackToHome={handleBackToHome}
          />
        );
      default:
        return <LandingPage onStartGame={handleStartGame} />;
    }
  };

  // Show loading state until the app is ready
  if (!isReady) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading Connect Four...</p>
        </div>
      </div>
    );
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={currentScreen}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.3 }}
      >
        {renderScreen()}
      </motion.div>
    </AnimatePresence>
  );
} 