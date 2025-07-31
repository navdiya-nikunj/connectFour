export type Player = 'red' | 'yellow' | null;

export type GameStatus = 'playing' | 'won' | 'draw' | 'waiting';

export interface GameState {
  board: Player[][];
  currentPlayer: 'red' | 'yellow';
  gameStatus: GameStatus;
  winner: Player;
  winningCells: [number, number][];
  lastMove: number | null;
}

export interface GameSettings {
  rows: number;
  cols: number;
  winLength: number;
}

export interface PlayerInfo {
  id: string;
  name: string;
  avatar?: string;
  farcasterId?: string;
}

export interface GameRoom {
  id: string;
  players: PlayerInfo[];
  spectators: PlayerInfo[];
  gameState: GameState;
  settings: GameSettings;
  createdAt: Date;
  updatedAt: Date;
}

export interface GameMove {
  column: number;
  player: 'red' | 'yellow';
  timestamp: Date;
}

export interface GameHistory {
  id: string;
  moves: GameMove[];
  winner: Player;
  players: PlayerInfo[];
  duration: number;
  createdAt: Date;
} 