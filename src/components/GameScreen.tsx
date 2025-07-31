'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { RotateCcw, Trophy, ArrowLeft, Home, Share } from 'lucide-react';
import GameBoard from './GameBoard';
import { GameState } from '@/types/game';
import { getInitialGameState, resetGame, updateGameState } from '@/utils/gameLogic';
import { getAIMove, AIDifficulty } from '@/utils/aiLogic';
import sdk from '@farcaster/miniapp-sdk';

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
    const gameUrl = window.location.href || 'https://connect-four-hazel.vercel.app';
    let castText = '';
    
    if (gameState.gameStatus === 'won') {
      const winner = gameState.winner === 'red' ? 'Red' : 'Yellow';
      castText = `🎮 Just won a game of Connect Four on Farcaster! ${winner} player took the victory! 🏆\n\nPlay now: ${gameUrl}`;
    } else if (gameState.gameStatus === 'draw') {
      castText = `🎮 Just played Connect Four on Farcaster! It was a thrilling draw! 🤝\n\nPlay now: ${gameUrl}`;
    } else {
      castText = `🎮 Playing Connect Four on Farcaster! Join the fun! 🎯\n\nPlay now: ${gameUrl}`;
    }
    sdk.actions.composeCast({
      text: castText,
      embeds: [gameUrl] 
    });
    
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-4 px-2">
      <div className="max-w-sm mx-auto">
        {/* Compact Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-4"
        >
          <div className="flex items-center space-x-2">
            <button
              onClick={onBackToSetup}
              className="flex items-center space-x-1 text-gray-600 hover:text-gray-800 transition-colors text-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Back</span>
            </button>
            <button
              onClick={onBackToHome}
              className="flex items-center space-x-1 text-gray-600 hover:text-gray-800 transition-colors text-sm"
            >
              <Home className="w-4 h-4" />
              <span className="hidden sm:inline">Home</span>
            </button>
          </div>
          <h1 className="text-xl font-bold text-gray-800">Connect Four</h1>
          <div className="w-16"></div> {/* Smaller spacer */}
        </motion.div>

        {/* Compact Game Mode Indicator */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-center mb-4"
        >
          <div className={`rounded-lg px-3 py-1 border text-xs ${
            gameState.gameStatus === 'playing'
              ? 'bg-yellow-50 border-yellow-200'
              : 'bg-blue-50 border-blue-200'
          }`}>
            <span className={`font-medium ${
              gameState.gameStatus === 'playing'
                ? 'text-yellow-800'
                : 'text-blue-800'
            }`}>
              {gameState.gameStatus === 'playing' ? '🎮 Playing' : `${getGameModeLabel(gameMode)}`}
              {gameMode === 'ai' && gameState.gameStatus !== 'playing' && ` (${aiDifficulty})`}
            </span>
          </div>
        </motion.div>

        {/* Game Board */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex justify-center mb-4"
        >
          <GameBoard
            gameState={gameState}
            onGameStateChange={handleGameStateChange}
            disabled={gameMode === 'multiplayer' || isAITurn}
            isAITurn={isAITurn}
          />
        </motion.div>

        {/* Compact Game Controls - Stacked vertically */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col space-y-2 mb-4"
        >
          <button
            onClick={handleResetGame}
            disabled={gameState.gameStatus === 'playing'}
            className={`flex items-center justify-center space-x-2 px-4 py-2 rounded-lg shadow-md transition-all text-sm ${
              gameState.gameStatus === 'playing'
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-white text-gray-700 hover:shadow-lg hover:bg-gray-50'
            }`}
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset Game</span>
          </button>
          
          <button
            onClick={handleNewGame}
            disabled={gameState.gameStatus === 'playing'}
            className={`flex items-center justify-center space-x-2 px-4 py-2 rounded-lg shadow-md transition-all text-sm ${
              gameState.gameStatus === 'playing'
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-blue-500 text-white hover:shadow-lg hover:bg-blue-600'
            }`}
          >
            <Trophy className="w-4 h-4" />
            <span>New Game</span>
          </button>
          
          <button
            onClick={handleShareResult}
            className="flex items-center justify-center space-x-2 px-4 py-2 rounded-lg shadow-md transition-all bg-purple-500 text-white hover:shadow-lg hover:bg-purple-600 text-sm"
          >
            <Share className="w-4 h-4" />
            <span>Share Result</span>
          </button>
        </motion.div>

        {/* Compact Game Statistics */}
        {gameState.gameStatus !== 'playing' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="bg-white rounded-lg p-4 shadow-md border border-gray-200">
              <h3 className="text-base font-semibold mb-3 text-gray-800">Game Summary</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-center space-x-2">
                  <div className={`w-3 h-3 rounded-full ${gameState.winner === 'red' ? 'bg-red-500' : gameState.winner === 'yellow' ? 'bg-yellow-500' : 'bg-gray-400'}`} />
                  <p className="text-gray-700 font-medium text-sm">
                    {gameState.gameStatus === 'won' 
                      ? `${gameState.winner === 'red' ? 'Red' : 'Yellow'} player won!`
                      : 'The game ended in a draw!'
                    }
                  </p>
                </div>
                <div className="bg-gray-50 rounded-lg p-2">
                  <p className="text-xs text-gray-600">
                    Total moves: <span className="font-semibold text-gray-800">{gameState.board.flat().filter(cell => cell !== null).length}</span>
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Compact Coming Soon Notice */}
        {gameMode === 'multiplayer' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-4 text-center"
          >
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <p className="text-yellow-800 font-medium text-sm">
                🚧 Multiplayer coming soon! 🚧
              </p>
              <p className="text-yellow-600 text-xs mt-1">
                Farcaster integration and real-time multiplayer will be available in the next update.
              </p>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
} 