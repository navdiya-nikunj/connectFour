'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { GameState, Player } from '@/types/game';
import { updateGameState, isValidMove } from '@/utils/gameLogic';

interface GameBoardProps {
  gameState: GameState;
  onGameStateChange: (newState: GameState) => void;
  disabled?: boolean;
  isAITurn?: boolean;
}

export default function GameBoard({ gameState, onGameStateChange, disabled = false, isAITurn = false }: GameBoardProps) {
  const [hoveredColumn, setHoveredColumn] = useState<number | null>(null);

  const handleColumnClick = (column: number) => {
    if (disabled || gameState.gameStatus !== 'playing') return;
    
    if (isValidMove(gameState.board, column)) {
      const newState = updateGameState(gameState, column);
      onGameStateChange(newState);
    }
  };

  const handleColumnHover = (column: number) => {
    if (disabled || gameState.gameStatus !== 'playing') return;
    setHoveredColumn(isValidMove(gameState.board, column) ? column : null);
  };

  const handleColumnLeave = () => {
    setHoveredColumn(null);
  };

  const renderPiece = (player: Player, row: number, col: number, isWinning: boolean) => {
    if (!player) return null;

    const isHovered = hoveredColumn === col && gameState.currentPlayer === player;
    const isLastMove = gameState.lastMove === col && row === gameState.board.length - 1;

    return (
      <motion.div
        key={`${row}-${col}`}
        className={`w-12 h-12 rounded-full border-2 border-gray-300 shadow-lg ${
          player === 'red' ? 'bg-red-500' : 'bg-yellow-500'
        } ${isWinning ? 'ring-4 ring-green-400 ring-opacity-75' : ''}`}
        initial={{ scale: 0, y: -50 }}
        animate={{ 
          scale: 1, 
          y: 0,
          boxShadow: isHovered ? '0 0 20px rgba(59, 130, 246, 0.5)' : '0 4px 6px rgba(0, 0, 0, 0.1)'
        }}
        transition={{ 
          type: "spring", 
          stiffness: 300, 
          damping: 20,
          delay: isLastMove ? 0.1 : 0
        }}
        whileHover={!disabled ? { scale: 1.05 } : {}}
      />
    );
  };

  const renderHoverPiece = (column: number) => {
    if (hoveredColumn !== column || gameState.gameStatus !== 'playing') return null;

    return (
      <motion.div
        className={`w-12 h-12 rounded-full border-2 border-gray-300 shadow-lg ${
          gameState.currentPlayer === 'red' ? 'bg-red-500' : 'bg-yellow-500'
        } opacity-50`}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      />
    );
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      {/* Game Status */}
      <div className="text-center">
        {gameState.gameStatus === 'playing' && (
          <div className="flex items-center justify-center space-x-4 bg-white rounded-lg px-6 py-3 shadow-lg">
            <div className={`w-4 h-4 rounded-full ${gameState.currentPlayer === 'red' ? 'bg-red-500' : 'bg-yellow-500'}`} />
            <span className="text-lg font-semibold text-gray-800">
              {isAITurn ? 'AI is thinking...' : `${gameState.currentPlayer === 'red' ? 'Red' : 'Yellow'}'s turn`}
            </span>
            {isAITurn && (
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            )}
          </div>
        )}
        {gameState.gameStatus === 'won' && (
          <div className="text-center">
            <div className="flex items-center justify-center space-x-4 mb-2 bg-green-50 rounded-lg px-6 py-3 shadow-lg border border-green-200">
              <div className={`w-4 h-4 rounded-full ${gameState.winner === 'red' ? 'bg-red-500' : 'bg-yellow-500'}`} />
              <span className="text-xl font-bold text-green-700">
                {gameState.winner === 'red' ? 'Red' : 'Yellow'} wins!
              </span>
            </div>
          </div>
        )}
        {gameState.gameStatus === 'draw' && (
          <div className="text-center">
            <div className="bg-gray-50 rounded-lg px-6 py-3 shadow-lg border border-gray-200">
              <span className="text-xl font-bold text-gray-700">It's a draw!</span>
            </div>
          </div>
        )}
      </div>

              {/* Game Board */}
        <div className="bg-blue-600 p-4 rounded-lg shadow-xl">
          {/* Current Player Indicator */}
          {gameState.gameStatus === 'playing' && (
            <div className="flex justify-center mb-2">
              <div className="bg-white rounded-lg px-3 py-1 shadow-md">
                <span className="text-sm font-medium text-gray-700">
                  Current Player: 
                  <span className={`ml-1 font-bold ${gameState.currentPlayer === 'red' ? 'text-red-600' : 'text-yellow-600'}`}>
                    {gameState.currentPlayer === 'red' ? 'Red' : 'Yellow'}
                  </span>
                </span>
              </div>
            </div>
          )}
          
          {/* Hover row */}
          <div className="flex space-x-1 mb-2">
            {gameState.board[0].map((_, col) => (
              <div
                key={`hover-${col}`}
                className="w-16 h-12 flex items-center justify-center"
              >
                {renderHoverPiece(col)}
              </div>
            ))}
          </div>

        {/* Game board */}
        <div className="grid grid-cols-7 gap-1">
          {gameState.board.map((row, rowIndex) =>
            row.map((cell, colIndex) => {
              const isWinning = gameState.winningCells.some(
                ([r, c]) => r === rowIndex && c === colIndex
              );

              return (
                <div
                  key={`${rowIndex}-${colIndex}`}
                  className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center cursor-pointer hover:bg-blue-400 transition-colors"
                  onClick={() => handleColumnClick(colIndex)}
                  onMouseEnter={() => handleColumnHover(colIndex)}
                  onMouseLeave={handleColumnLeave}
                >
                  {renderPiece(cell, rowIndex, colIndex, isWinning)}
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Column indicators */}
      <div className="flex space-x-1">
        {gameState.board[0].map((_, col) => (
          <div
            key={`indicator-${col}`}
            className="w-16 h-2 bg-gray-300 rounded"
          />
        ))}
      </div>
    </div>
  );
} 