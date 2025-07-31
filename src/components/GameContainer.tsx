'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { RotateCcw, Trophy, Users, Bot } from 'lucide-react';
import GameBoard from './GameBoard';
import FarcasterAuth from './FarcasterAuth';
import { GameState } from '@/types/game';
import { getInitialGameState, resetGame, updateGameState } from '@/utils/gameLogic';
import { getAIMove, AIDifficulty } from '@/utils/aiLogic';

export default function GameContainer() {
  const [gameState, setGameState] = useState<GameState>(getInitialGameState());
  const [gameMode, setGameMode] = useState<'local' | 'ai' | 'multiplayer'>('local');
  const [aiDifficulty, setAiDifficulty] = useState<AIDifficulty>('medium');
  const [isAITurn, setIsAITurn] = useState(false);
  const [farcasterUser, setFarcasterUser] = useState<any>(null);

  const handleGameStateChange = (newState: GameState) => {
    setGameState(newState);
    
    // If playing against AI and it's AI's turn, make AI move
    if (gameMode === 'ai' && newState.gameStatus === 'playing' && newState.currentPlayer === 'yellow') {
      setIsAITurn(true);
    }
  };

  const handleResetGame = () => {
    setGameState(resetGame());
  };

  const handleNewGame = () => {
    setGameState(getInitialGameState());
    setIsAITurn(false);
  };

  const getGameModeIcon = (mode: string) => {
    switch (mode) {
      case 'local':
        return <Users className="w-5 h-5" />;
      case 'ai':
        return <Bot className="w-5 h-5" />;
      case 'multiplayer':
        return <Trophy className="w-5 h-5" />;
      default:
        return <Users className="w-5 h-5" />;
    }
  };

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Connect Four
          </h1>
          <p className="text-gray-600">
            The classic game, reimagined for Farcaster
          </p>
        </motion.div>

        {/* Farcaster Authentication
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-center mb-6"
        >
          <FarcasterAuth onUserChange={setFarcasterUser} />
        </motion.div> */}

        {/* Current Game Mode Indicator */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-center mb-4"
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
              {gameState.gameStatus === 'playing' ? '🎮 Game in Progress' : `Current Mode: ${getGameModeLabel(gameMode)}`}
              {gameMode === 'ai' && gameState.gameStatus !== 'playing' && ` (${aiDifficulty})`}
            </span>
          </div>
        </motion.div>

        {/* Game Mode Selector */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center space-y-4 mb-8"
        >
          <div className="flex space-x-2 bg-white rounded-lg p-2 shadow-lg">
            {(['local', 'ai', 'multiplayer'] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => setGameMode(mode)}
                disabled={gameState.gameStatus === 'playing'}
                className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-all ${
                  gameMode === mode
                    ? 'bg-blue-500 text-white shadow-md'
                    : gameState.gameStatus === 'playing'
                    ? 'text-gray-400 cursor-not-allowed'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {getGameModeIcon(mode)}
                <span className="hidden sm:inline">{getGameModeLabel(mode)}</span>
              </button>
            ))}
          </div>
          
          {/* AI Difficulty Selector */}
          {gameMode === 'ai' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex space-x-2 bg-white rounded-lg p-2 shadow-lg"
            >
              {(['easy', 'medium', 'hard'] as const).map((difficulty) => (
                <button
                  key={difficulty}
                  onClick={() => setAiDifficulty(difficulty)}
                  disabled={gameState.gameStatus === 'playing'}
                  className={`px-4 py-2 rounded-md transition-all capitalize ${
                    aiDifficulty === difficulty
                      ? 'bg-green-500 text-white shadow-md'
                      : gameState.gameStatus === 'playing'
                      ? 'text-gray-400 cursor-not-allowed'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {difficulty}
                </button>
              ))}
            </motion.div>
          )}
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
            disabled={gameMode === 'multiplayer' || isAITurn} // Disable for now until multiplayer is implemented
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