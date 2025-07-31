import { GameState, Player } from '@/types/game';
import { isValidMove, getLowestEmptyRow, checkWin } from './gameLogic';

export type AIDifficulty = 'easy' | 'medium' | 'hard';

export function getAIMove(gameState: GameState, difficulty: AIDifficulty): number {
  switch (difficulty) {
    case 'easy':
      return getEasyMove(gameState);
    case 'medium':
      return getMediumMove(gameState);
    case 'hard':
      return getHardMove(gameState);
    default:
      return getEasyMove(gameState);
  }
}

function getEasyMove(gameState: GameState): number {
  const validMoves = getValidMoves(gameState.board);
  return validMoves[Math.floor(Math.random() * validMoves.length)];
}

function getMediumMove(gameState: GameState): number {
  const validMoves = getValidMoves(gameState.board);
  
  // First, check if AI can win in one move
  for (const col of validMoves) {
    const testBoard = makeTestMove(gameState.board, col, gameState.currentPlayer);
    const row = getLowestEmptyRow(gameState.board, col);
    if (row !== -1) {
      const [hasWon] = checkWin(testBoard, row, col, gameState.currentPlayer);
      if (hasWon) return col;
    }
  }
  
  // Then, check if opponent can win in one move and block
  const opponent = gameState.currentPlayer === 'red' ? 'yellow' : 'red';
  for (const col of validMoves) {
    const testBoard = makeTestMove(gameState.board, col, opponent);
    const row = getLowestEmptyRow(gameState.board, col);
    if (row !== -1) {
      const [hasWon] = checkWin(testBoard, row, col, opponent);
      if (hasWon) return col;
    }
  }
  
  // Otherwise, make a random move
  return validMoves[Math.floor(Math.random() * validMoves.length)];
}

function getHardMove(gameState: GameState): number {
  const validMoves = getValidMoves(gameState.board);
  
  // First, check if AI can win in one move
  for (const col of validMoves) {
    const testBoard = makeTestMove(gameState.board, col, gameState.currentPlayer);
    const row = getLowestEmptyRow(gameState.board, col);
    if (row !== -1) {
      const [hasWon] = checkWin(testBoard, row, col, gameState.currentPlayer);
      if (hasWon) return col;
    }
  }
  
  // Then, check if opponent can win in one move and block
  const opponent = gameState.currentPlayer === 'red' ? 'yellow' : 'red';
  for (const col of validMoves) {
    const testBoard = makeTestMove(gameState.board, col, opponent);
    const row = getLowestEmptyRow(gameState.board, col);
    if (row !== -1) {
      const [hasWon] = checkWin(testBoard, row, col, opponent);
      if (hasWon) return col;
    }
  }
  
  // Try to create opportunities for winning
  const centerCol = Math.floor(gameState.board[0].length / 2);
  if (isValidMove(gameState.board, centerCol)) {
    return centerCol;
  }
  
  // Prefer moves that don't give opponent immediate winning opportunities
  const safeMoves = validMoves.filter(col => {
    const testBoard = makeTestMove(gameState.board, col, gameState.currentPlayer);
    const row = getLowestEmptyRow(gameState.board, col);
    if (row !== -1) {
      // Check if this move would give opponent a winning opportunity
      const opponentTestBoard = makeTestMove(testBoard, col, opponent);
      const [hasWon] = checkWin(opponentTestBoard, row, col, opponent);
      return !hasWon;
    }
    return true;
  });
  
  return safeMoves.length > 0 ? safeMoves[0] : validMoves[0];
}

function getValidMoves(board: Player[][]): number[] {
  const moves: number[] = [];
  for (let col = 0; col < board[0].length; col++) {
    if (isValidMove(board, col)) {
      moves.push(col);
    }
  }
  return moves;
}

function makeTestMove(board: Player[][], column: number, player: Player): Player[][] {
  const newBoard = board.map(row => [...row]);
  const row = getLowestEmptyRow(newBoard, column);
  
  if (row !== -1) {
    newBoard[row][column] = player;
  }
  
  return newBoard;
} 