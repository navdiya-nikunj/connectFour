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

    global.mongoose.promise = mongoose.connect(MONGODB_URI, opts);
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

// Create models
const User = mongoose.models.User || mongoose.model('User', userSchema);
const GameHistory = mongoose.models.GameHistory || mongoose.model('GameHistory', gameHistorySchema);

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

  return gameHistory;
}
