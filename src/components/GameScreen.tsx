'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { RotateCcw, Trophy, ArrowLeft, Home, Share } from 'lucide-react';
import { sdk } from '@farcaster/miniapp-sdk';
import GameBoard from './GameBoard';
import { GameState } from '@/types/game';
import { getInitialGameState, resetGame, updateGameState } from '@/utils/gameLogic';
import { getAIMove, AIDifficulty } from '@/utils/aiLogic';

interface GameScreenProps {
  gameMode: 'local' | 'ai' | 'multiplayer';
  aiDifficulty: AIDifficulty;
  onBackToSetup: () => void;
  onBackToHome: () => void;
}

export default function GameScreen({ gameMode, aiDifficulty, onBackToSetup, onBackToHome }: GameScreenProps) {
  const [gameState, setGameState] = useState<GameState>(getInitialGameState());
  const [isAITurn, setIsAITurn] = useState(false);

  const handleGameStateChange = (newState: GameState) => {
    setGameState(newState);
    
    // If playing against AI and it's AI's turn, make AI move
    if (gameMode === 'ai' && newState.gameStatus === 'playing' && newState.currentPlayer === 'yellow') {
      setIsAITurn(true);
    }
  };

  const handleResetGame = () => {
    setGameState(resetGame());
    setIsAITurn(false);
  };

  const handleNewGame = () => {
    setGameState(getInitialGameState());
    setIsAITurn(false);
  };

  const handleShareResult = () => {
    const gameUrl = window.location.href;
    let castText = '';
    
    if (gameState.gameStatus === 'won') {
      const winner = gameState.winner === 'red' ? 'Red' : 'Yellow';
      castText = `🎮 Just won a game of Connect Four on Farcaster! ${winner} player took the victory! 🏆\n\nPlay now: ${gameUrl}`;
    } else if (gameState.gameStatus === 'draw') {
      castText = `🎮 Just played Connect Four on Farcaster! It was a thrilling draw! 🤝\n\nPlay now: ${gameUrl}`;
    } else {
      castText = `🎮 Playing Connect Four on Farcaster! Join the fun! 🎯\n\nPlay now: ${gameUrl}`;
    }
    
    // Create Farcaster cast URL with embeddings
    const farcasterUrl = `https://warpcast.com/~/compose?text=${encodeURIComponent(castText)}&embeds=${encodeURIComponent(gameUrl)}`;
    
    // Open in new tab
    window.open(farcasterUrl, '_blank');
  };

  // AI move effect
  useEffect(() => {
    if (isAITurn && gameMode === 'ai' && gameState.gameStatus === 'playing') {
      const timer = setTimeout(() => {
        const aiMove = getAIMove(gameState, aiDifficulty);
        const newState = updateGameState(gameState, aiMove);
        setGameState(newState);
        setIsAITurn(false);
      }, 1000); // 1 second delay for AI thinking

      return () => clearTimeout(timer);
    }
  }, [isAITurn, gameMode, gameState, aiDifficulty]);

  const getGameModeLabel = (mode: string) => {
    switch (mode) {
      case 'local':
        return 'Local 2-Player';
      case 'ai':
        return 'vs AI';
      case 'multiplayer':
        return 'Online Multiplayer';
      default:
        return 'Local 2-Player';
    }
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
          <div className="flex items-center space-x-4">
            <button
              onClick={onBackToSetup}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Setup</span>
            </button>
            <button
              onClick={onBackToHome}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              <Home className="w-5 h-5" />
              <span>Home</span>
            </button>
          </div>
          <h1 className="text-3xl font-bold text-gray-800">Connect Four</h1>
          <div className="w-32"></div> {/* Spacer for centering */}
        </motion.div>

        {/* Game Mode Indicator */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-center mb-6"
        >
          <div className={`rounded-lg px-4 py-2 border ${
            gameState.gameStatus === 'playing'
              ? 'bg-yellow-50 border-yellow-200'
              : 'bg-blue-50 border-blue-200'
          }`}>
            <span className={`text-sm font-medium ${
              gameState.gameStatus === 'playing'
                ? 'text-yellow-800'
                : 'text-blue-800'
            }`}>
              {gameState.gameStatus === 'playing' ? '🎮 Game in Progress' : `Mode: ${getGameModeLabel(gameMode)}`}
              {gameMode === 'ai' && gameState.gameStatus !== 'playing' && ` (${aiDifficulty})`}
            </span>
          </div>
        </motion.div>

        {/* Game Board */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex justify-center mb-8"
        >
          <GameBoard
            gameState={gameState}
            onGameStateChange={handleGameStateChange}
            disabled={gameMode === 'multiplayer' || isAITurn}
            isAITurn={isAITurn}
          />
        </motion.div>

        {/* Game Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-center space-x-4"
        >
          <button
            onClick={handleResetGame}
            disabled={gameState.gameStatus === 'playing'}
            className={`flex items-center space-x-2 px-6 py-3 rounded-lg shadow-lg transition-all ${
              gameState.gameStatus === 'playing'
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-white text-gray-700 hover:shadow-xl hover:bg-gray-50'
            }`}
          >
            <RotateCcw className="w-5 h-5" />
            <span>Reset Game</span>
          </button>
          
          <button
            onClick={handleNewGame}
            disabled={gameState.gameStatus === 'playing'}
            className={`flex items-center space-x-2 px-6 py-3 rounded-lg shadow-lg transition-all ${
              gameState.gameStatus === 'playing'
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-blue-500 text-white hover:shadow-xl hover:bg-blue-600'
            }`}
          >
            <Trophy className="w-5 h-5" />
            <span>New Game</span>
          </button>
          
          <button
            onClick={handleShareResult}
            className="flex items-center space-x-2 px-6 py-3 rounded-lg shadow-lg transition-all bg-purple-500 text-white hover:shadow-xl hover:bg-purple-600"
          >
            <Share className="w-5 h-5" />
            <span>Share Result</span>
          </button>
        </motion.div>

        {/* Game Statistics */}
        {gameState.gameStatus !== 'playing' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 text-center"
          >
            <div className="bg-white rounded-lg p-6 shadow-lg max-w-md mx-auto border border-gray-200">
              <h3 className="text-lg font-semibold mb-4 text-gray-800">Game Summary</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-center space-x-2">
                  <div className={`w-3 h-3 rounded-full ${gameState.winner === 'red' ? 'bg-red-500' : gameState.winner === 'yellow' ? 'bg-yellow-500' : 'bg-gray-400'}`} />
                  <p className="text-gray-700 font-medium">
                    {gameState.gameStatus === 'won' 
                      ? `${gameState.winner === 'red' ? 'Red' : 'Yellow'} player won!`
                      : 'The game ended in a draw!'
                    }
                  </p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-sm text-gray-600">
                    Total moves: <span className="font-semibold text-gray-800">{gameState.board.flat().filter(cell => cell !== null).length}</span>
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Coming Soon Notice */}
        {gameMode === 'multiplayer' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-8 text-center"
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