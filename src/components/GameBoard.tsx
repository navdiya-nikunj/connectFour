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
        className={`w-7 h-7 rounded-full border-2 border-gray-300 shadow-lg ${
          player === 'red' ? 'bg-pink-500' : 'bg-blue-500'
        } ${isWinning ? 'ring-4 ring-green-500 ring-opacity-100 animate-pulse' : ''}`}
        initial={{ scale: 0, y: -30 }}
        animate={{ 
          scale: 1, 
          y: 0,
          boxShadow: isHovered ? '0 0 10px rgba(59, 130, 246, 0.5)' : '0 2px 3px rgba(0, 0, 0, 0.08)'
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
        className={`w-7 h-7 rounded-full border-2 border-gray-300 shadow-lg ${
          gameState.currentPlayer === 'red' ? 'bg-pink-500' : 'bg-blue-500'
        } opacity-50`}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      />
    );
  };

  return (
    <div className="flex flex-col items-center space-y-2">
      {/* Game Status */}
      <div className="text-center">
        {gameState.gameStatus === 'playing' && (
          <div className="flex items-center justify-center space-x-2 bg-white rounded-lg px-3 py-2 shadow-md">
            <div className={`w-3 h-3 rounded-full ${gameState.currentPlayer === 'red' ? 'bg-pink-500' : 'bg-blue-500'}`} />
            <span className="text-base font-semibold text-gray-800">
              {isAITurn ? 'AI is thinking...' : `${gameState.currentPlayer === 'red' ? 'Pink' : 'Blue'}'s turn`}
            </span>
            {isAITurn && (
              <div className="flex space-x-0.5">
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce"></div>
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            )}
          </div>
        )}
        {gameState.gameStatus === 'won' && (
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-1 bg-green-50 rounded-lg px-3 py-2 shadow-md border border-green-200">
              <div className={`w-3 h-3 rounded-full ${gameState.winner === 'red' ? 'bg-pink-500' : 'bg-blue-500'}`} />
              <span className="text-base font-bold text-green-700">
                {gameState.winner === 'red' ? 'Pink' : 'Blue'} wins!
              </span>
            </div>
          </div>
        )}
        {gameState.gameStatus === 'draw' && (
          <div className="text-center">
            <div className="bg-gray-50 rounded-lg px-3 py-2 shadow-md border border-gray-200">
              <span className="text-base font-bold text-gray-700">It&apos;s a draw!</span>
            </div>
          </div>
        )}
      </div>

      {/* Game Board */}
      <div className="bg-white border-2 border-gray-300 p-2 rounded-lg shadow-lg">
        {/* Current Player Indicator */}
        {gameState.gameStatus === 'playing' && (
          <div className="flex justify-center mb-1">
            <div className="bg-white rounded-lg px-2 py-0.5 shadow-sm">
              <span className="text-xs font-medium text-gray-700">
                Current Player: 
                <span className={`ml-1 font-bold ${gameState.currentPlayer === 'red' ? 'text-pink-600' : 'text-blue-600'}`}>{gameState.currentPlayer === 'red' ? 'Pink' : 'Blue'}</span>
              </span>
            </div>
          </div>
        )}
        {/* Hover row */}
        <div className="flex space-x-0.5 mb-1">
          {gameState.board[0].map((_, col) => (
            <div
              key={`hover-${col}`}
              className="w-9 h-7 flex items-center justify-center"
            >
              {renderHoverPiece(col)}
            </div>
          ))}
        </div>
        {/* Game board */}
        <div className="grid grid-cols-7 gap-0.5">
          {gameState.board.map((row, rowIndex) =>
            row.map((cell, colIndex) => {
              const isWinning = gameState.winningCells.some(
                ([r, c]) => r === rowIndex && c === colIndex
              );

              return (
                <div
                  key={`${rowIndex}-${colIndex}`}
                  className={`w-9 h-9 bg-white border-2 border-gray-300 rounded-full flex items-center justify-center cursor-pointer hover:bg-gray-200  transition-colors`}
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
      <div className="flex space-x-0.5">
        {gameState.board[0].map((_, col) => (
          <div
            key={`indicator-${col}`}
            className="w-9 h-1.5 bg-gray-300 rounded"
          />
        ))}
      </div>
    </div>
  );
} 