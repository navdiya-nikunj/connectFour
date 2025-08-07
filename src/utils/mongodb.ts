/* eslint-disable @typescript-eslint/no-explicit-any */
import mongoose from 'mongoose';

if (!process.env.MONGODB_URI) {
  throw new Error('Please add your Mongo URI to .env.local');
}

const MONGODB_URI = process.env.MONGODB_URI;

// Extend global type for mongoose connection
declare global {
  var mongoose: {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
  };
}

if (!global.mongoose) {
  global.mongoose = {
    conn: null,
    promise: null,
  };
}

async function dbConnect() {
  if (global.mongoose.conn) {
    return global.mongoose.conn;
  }

  if (!global.mongoose.promise) {
    const opts = {
      bufferCommands: false,
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    global.mongoose.promise = mongoose.connect(MONGODB_URI, opts) as any;
  }

  try {
    global.mongoose.conn = await global.mongoose.promise;
  } catch (e) {
    global.mongoose.promise = null;
    throw e;
  }

  return global.mongoose.conn;
}

// User Schema
const userSchema = new mongoose.Schema({
  fid: { type: Number, required: true, unique: true },
  username: { type: String },
  displayName: { type: String },
  avatar: { type: String },
  primaryAddress: { type: String },
}, {
  timestamps: true,
});

// Game History Schema
const gameHistorySchema = new mongoose.Schema({
  gameMode: { 
    type: String, 
    required: true, 
    enum: ['local', 'ai', 'multiplayer'] 
  },
  aiDifficulty: { 
    type: String, 
    enum: ['easy', 'medium', 'hard'] 
  },
  winner: { 
    type: String, 
    required: true, 
    enum: ['red', 'yellow', 'draw'] 
  },
  players: {
    red: {
      fid: { type: Number, required: true },
      username: { type: String },
      displayName: { type: String },
      avatar: { type: String },
    },
    yellow: {
      fid: { type: Number, required: true },
      username: { type: String },
      displayName: { type: String },
      avatar: { type: String },
    },
  },
  moves: [{
    column: { type: Number, required: true },
    player: { type: String, required: true, enum: ['red', 'yellow'] },
    timestamp: { type: Date, default: Date.now },
  }],
  duration: { type: Number, required: true }, // in milliseconds
}, {
  timestamps: true,
});

// User Streak Schema
const userStreakSchema = new mongoose.Schema({
  fid: { type: Number, required: true, unique: true },
  currentStreak: { type: Number, default: 0 },
  longestStreak: { type: Number, default: 0 },
  totalWins: { type: Number, default: 0 },
  totalGames: { type: Number, default: 0 },
  lastWinDate: { type: Date },
  streakStartDate: { type: Date },
}, {
  timestamps: true,
});

// Create models
const User = mongoose.models.User || mongoose.model('User', userSchema);
const GameHistory = mongoose.models.GameHistory || mongoose.model('GameHistory', gameHistorySchema);
const UserStreak = mongoose.models.UserStreak || mongoose.model('UserStreak', userStreakSchema);

export interface IUser {
  fid: number;
  username?: string;
  displayName?: string;
  avatar?: string;
  primaryAddress?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IGameHistory {
  _id: string;
  gameMode: 'local' | 'ai' | 'multiplayer';
  aiDifficulty?: 'easy' | 'medium' | 'hard';
  winner: 'red' | 'yellow' | 'draw';
  players: {
    red: {
      fid: number;
      username?: string;
      displayName?: string;
      avatar?: string;
    };
    yellow: {
      fid: number;
      username?: string;
      displayName?: string;
      avatar?: string;
    };
  };
  moves: Array<{
    column: number;
    player: 'red' | 'yellow';
    timestamp: Date;
  }>;
  duration: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface IUserStreak {
  _id: string;
  fid: number;
  currentStreak: number;
  longestStreak: number;
  totalWins: number;
  totalGames: number;
  lastWinDate?: Date;
  streakStartDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export async function createOrUpdateUser(userData: Omit<IUser, 'createdAt' | 'updatedAt'>): Promise<IUser> {
  await dbConnect();
  
  const user = await User.findOneAndUpdate(
    { fid: userData.fid },
    userData,
    { 
      upsert: true, 
      new: true,
      setDefaultsOnInsert: true
    }
  );

  return user.toObject();
}

export async function getUserByFid(fid: number): Promise<IUser | null> {
  await dbConnect();
  
  const user = await User.findOne({ fid });
  return user ? user.toObject() : null;
  // return user ? user.toObject() : null;
}

export async function saveGameHistory(gameHistory: Omit<IGameHistory, '_id' | 'createdAt' | 'updatedAt'>): Promise<IGameHistory> {
  await dbConnect();
  
  const history = new GameHistory(gameHistory);
  const savedHistory = await history.save();
  
  return savedHistory.toObject();
}

export async function getGameHistoryByUser(fid: number, limit = 10): Promise<IGameHistory[]> {
  await dbConnect();
  
  const gameHistory = await GameHistory.find({
    $or: [
      { 'players.red.fid': fid },
      { 'players.yellow.fid': fid }
    ]
  })
  .sort({ createdAt: -1 })
  .limit(limit)
  .lean();

  return gameHistory as any;
}

// Streak-related functions
export async function getUserStreak(fid: number): Promise<IUserStreak | null> {
  await dbConnect();
  
  const streak = await UserStreak.findOne({ fid });
  if (!streak) return null;
  
  // Check if the current streak has expired (more than 24 hours since last win)
  const now = new Date();
  if (streak.lastWinDate && streak.currentStreak > 0) {
    const timeSinceLastWin = now.getTime() - streak.lastWinDate.getTime();
    const hasExpired = timeSinceLastWin > 24 * 60 * 60 * 1000; // 24 hours in milliseconds
    
    if (hasExpired) {
      // Reset the expired streak
      streak.currentStreak = 0;
      streak.streakStartDate = null;
      streak.updatedAt = now;
      await streak.save();
    }
  }
  
  return streak.toObject();
}


export async function checkAndResetExpiredStreaks(): Promise<void> {
  await dbConnect();
  
  const now = new Date();
  const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  
  // Find all streaks that have expired (last win was more than 24 hours ago)
  const expiredStreaks = await UserStreak.find({
    lastWinDate: { $lt: twentyFourHoursAgo },
    currentStreak: { $gt: 0 }
  });
  
  // Reset expired streaks
  for (const streak of expiredStreaks) {
    streak.currentStreak = 0;
    streak.streakStartDate = null;
    streak.updatedAt = now;
    await streak.save();
  }
}

export async function updateStreakAfterGame(fid: number, isWin: boolean): Promise<IUserStreak> {
  await dbConnect();
  
  let streak = await UserStreak.findOne({ fid });
  
  if (!streak) {
    streak = new UserStreak({ 
      fid, 
      currentStreak: 0, 
      longestStreak: 0, 
      totalWins: 0, 
      totalGames: 0,
      lastWinDate: null,
      streakStartDate: null
    });
  }

  // Update total games
  streak.totalGames += 1;

  if (isWin) {
    // Update total wins
    streak.totalWins += 1;
    const now = new Date();
    streak.lastWinDate = now;
    
    // Check if this is the first win or if 24 hours have passed since last win
    const shouldStartNewStreak = !streak.lastWinDate || 
      (now.getTime() - streak.lastWinDate.getTime()) > 24 * 60 * 60 * 1000;
    
    if (shouldStartNewStreak) {
      // Start a new streak (first win or more than 24 hours since last win)
      streak.currentStreak = 1;
      streak.streakStartDate = now;
    } else {
      // Continue existing streak (within 24 hours)
      streak.currentStreak += 1;
      // Keep the original streak start date
    }
    
    // Update longest streak if current streak is longer
    if (streak.currentStreak > streak.longestStreak) {
      streak.longestStreak = streak.currentStreak;
    }
  } else {
    // On loss, don't reset the streak immediately
    // The streak will be reset if the user doesn't win within 24 hours
    // This allows for a more forgiving streak system
  }

  streak.updatedAt = new Date();
  const savedStreak = await streak.save();
  
  return savedStreak.toObject();
}

export async function getTopStreaks(limit = 10): Promise<IUserStreak[]> {
  await dbConnect();
  
  const streaks = await UserStreak.find({})
    .sort({ currentStreak: -1, longestStreak: -1 })
    .limit(limit)
    .lean();

  return streaks as any;
}
