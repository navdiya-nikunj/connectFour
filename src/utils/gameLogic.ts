import { GameState, Player, GameSettings } from '@/types/game';

export const DEFAULT_SETTINGS: GameSettings = {
  rows: 6,
  cols: 7,
  winLength: 4,
};

export function createEmptyBoard(rows: number, cols: number): Player[][] {
  return Array(rows).fill(null).map(() => Array(cols).fill(null));
}

export function getInitialGameState(): GameState {
  return {
    board: createEmptyBoard(DEFAULT_SETTINGS.rows, DEFAULT_SETTINGS.cols),
    currentPlayer: 'red',
    gameStatus: 'playing',
    winner: null,
    winningCells: [],
    lastMove: null,
  };
}

export function isValidMove(board: Player[][], column: number): boolean {
  return column >= 0 && column < board[0].length && board[0][column] === null;
}

export function getLowestEmptyRow(board: Player[][], column: number): number {
  for (let row = board.length - 1; row >= 0; row--) {
    if (board[row][column] === null) {
      return row;
    }
  }
  return -1;
}

export function makeMove(board: Player[][], column: number, player: Player): Player[][] {
  const newBoard = board.map(row => [...row]);
  const row = getLowestEmptyRow(newBoard, column);
  
  if (row !== -1) {
    newBoard[row][column] = player;
  }
  
  return newBoard;
}

export function checkWin(board: Player[][], row: number, col: number, player: Player): [boolean, [number, number][]] {
  const directions = [
    [0, 1],   // horizontal
    [1, 0],   // vertical
    [1, 1],   // diagonal down-right
    [1, -1],  // diagonal down-left
  ];

  for (const [dx, dy] of directions) {
    const winningCells: [number, number][] = [];
    let count = 1;
    
    // Check in positive direction
    for (let i = 1; i < 4; i++) {
      const newRow = row + i * dx;
      const newCol = col + i * dy;
      
      if (
        newRow >= 0 && newRow < board.length &&
        newCol >= 0 && newCol < board[0].length &&
        board[newRow][newCol] === player
      ) {
        count++;
        winningCells.push([newRow, newCol]);
      } else {
        break;
      }
    }
    
    // Check in negative direction
    for (let i = 1; i < 4; i++) {
      const newRow = row - i * dx;
      const newCol = col - i * dy;
      
      if (
        newRow >= 0 && newRow < board.length &&
        newCol >= 0 && newCol < board[0].length &&
        board[newRow][newCol] === player
      ) {
        count++;
        winningCells.push([newRow, newCol]);
      } else {
        break;
      }
    }
    
    if (count >= 4) {
      winningCells.push([row, col]);
      return [true, winningCells];
    }
  }
  
  return [false, []];
}

export function checkDraw(board: Player[][]): boolean {
  return board[0].every(cell => cell !== null);
}

export function updateGameState(
  gameState: GameState,
  column: number
): GameState {
  if (gameState.gameStatus !== 'playing') {
    return gameState;
  }

  if (!isValidMove(gameState.board, column)) {
    return gameState;
  }

  const newBoard = makeMove(gameState.board, column, gameState.currentPlayer);
  const row = getLowestEmptyRow(gameState.board, column);
  
  if (row === -1) {
    return gameState;
  }

  const [hasWon, winningCells] = checkWin(newBoard, row, column, gameState.currentPlayer);
  const isDraw = checkDraw(newBoard);

  return {
    board: newBoard,
    currentPlayer: gameState.currentPlayer === 'red' ? 'yellow' : 'red',
    gameStatus: hasWon ? 'won' : isDraw ? 'draw' : 'playing',
    winner: hasWon ? gameState.currentPlayer : null,
    winningCells: hasWon ? winningCells : [],
    lastMove: column,
  };
}

export function resetGame(): GameState {
  return getInitialGameState();
} 