# Connect Four Mini App Setup Guide

This guide will help you set up the Connect Four mini app with Farcaster authentication and MongoDB integration.

## Prerequisites

1. **Node.js 22.11.0 or higher** (LTS version recommended)
2. **MongoDB Atlas account** or local MongoDB instance
3. **Farcaster account** for testing

## Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   ```bash
   cp .env.local.example .env.local
   ```
   
   Edit `.env.local` and add your MongoDB connection string:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/connect-four?retryWrites=true&w=majority
   HOSTNAME=localhost:3000
   ```

3. **Test database connection:**
   ```bash
   npm run setup-db
   ```
   
   This will verify your MongoDB connection and show database information.

## MongoDB Setup

### Option 1: MongoDB Atlas (Recommended)

1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a free cluster
3. Create a database user with read/write permissions
4. Get your connection string and add it to `.env.local`

### Option 2: Local MongoDB

1. Install MongoDB locally
2. Start MongoDB service
3. Use connection string: `mongodb://localhost:27017/connect-four`

## Farcaster Developer Mode

1. Make sure you're logged in to Farcaster on mobile or desktop
2. Visit: https://farcaster.xyz/~/settings/developer-tools
3. Toggle on "Developer Mode"
4. A developer section will appear on the left side of your desktop display

## Running the App

1. **Start the development server:**
   ```bash
   npm run dev
   ```

2. **Open the app in your browser:**
   - Navigate to `http://localhost:3000`
   - The app will show a loading screen until you call `sdk.actions.ready()`

## Features

### Database & ORM
- **Mongoose Integration:** Uses Mongoose ODM for MongoDB with schema validation
- **Type Safety:** Full TypeScript support with Mongoose schemas and interfaces
- **Connection Management:** Optimized database connections with connection pooling
- **Schema Validation:** Automatic data validation and type checking

### Authentication
- **Quick Auth Integration:** Uses Farcaster's Quick Auth for seamless authentication
- **User Management:** Automatically creates/updates user profiles in MongoDB
- **Token Validation:** Secure JWT validation on the server side

### Game Features
- **Local 2-Player Mode:** Play against a friend on the same device
- **AI Mode:** Play against AI with three difficulty levels (Easy, Medium, Hard)
- **Game History:** All games are saved to MongoDB with detailed move tracking
- **Share Results:** Share game results on Farcaster with embedded links

### Database Collections

The app uses Mongoose schemas to create two main collections in MongoDB:

1. **`users`** - Stores Farcaster user profiles
   - `fid`: Farcaster ID (Number, required, unique)
   - `username`: Farcaster username (String)
   - `displayName`: User's display name (String)
   - `avatar`: Profile picture URL (String)
   - `primaryAddress`: User's primary Ethereum address (String)
   - `createdAt`: Account creation timestamp (auto-generated)
   - `updatedAt`: Last update timestamp (auto-generated)

2. **`gamehistories`** - Stores completed games
   - `_id`: Unique game ID (auto-generated)
   - `gameMode`: 'local' | 'ai' | 'multiplayer' (required)
   - `aiDifficulty`: AI difficulty level - 'easy' | 'medium' | 'hard' (optional)
   - `winner`: 'red' | 'yellow' | 'draw' (required)
   - `players`: Object with red and yellow player info
     - `red.fid`: Red player's FID (Number, required)
     - `red.username`: Red player's username (String)
     - `red.displayName`: Red player's display name (String)
     - `red.avatar`: Red player's avatar (String)
     - `yellow.fid`: Yellow player's FID (Number, required)
     - `yellow.username`: Yellow player's username (String)
     - `yellow.displayName`: Yellow player's display name (String)
     - `yellow.avatar`: Yellow player's avatar (String)
   - `moves`: Array of all moves with timestamps
     - `column`: Column number (Number, required)
     - `player`: 'red' | 'yellow' (required)
     - `timestamp`: Move timestamp (Date, auto-generated)
   - `duration`: Game duration in milliseconds (Number, required)
   - `createdAt`: Game completion timestamp (auto-generated)
   - `updatedAt`: Last update timestamp (auto-generated)

## API Endpoints

### `/api/user` (GET)
- **Authentication:** Required (Quick Auth token)
- **Response:** User profile data
- **Purpose:** Get or create user profile

### `/api/game-history` (POST)
- **Authentication:** Required (Quick Auth token)
- **Body:** Game history data
- **Purpose:** Save completed game

### `/api/game-history` (GET)
- **Authentication:** Required (Quick Auth token)
- **Query:** `limit` (optional, default: 10)
- **Purpose:** Get user's game history

### `/api/game` (POST)
- **Body:** `{ gameState, column }`
- **Purpose:** Make a move in the game

### `/api/game` (GET)
- **Purpose:** Get initial game state

### `/api/test-db` (GET)
- **Purpose:** Test database connection status
- **Response:** Database connection state and status

## Development Tips

1. **Testing Authentication:**
   - Use Farcaster's developer mode to test the mini app
   - Check browser console for authentication logs

2. **Database Debugging:**
   - Use MongoDB Compass or Atlas dashboard to view data
   - Check server logs for database connection issues

3. **Environment Variables:**
   - Never commit `.env.local` to version control
   - Use different MongoDB databases for development/production

## Deployment

1. **Vercel (Recommended):**
   ```bash
   npm run build
   vercel --prod
   ```

2. **Environment Variables:**
   - Add `MONGODB_URI` to your deployment environment
   - Set `HOSTNAME` to your production domain

3. **Farcaster Integration:**
   - Update your app's domain in Farcaster settings
   - Test authentication in production environment

## Troubleshooting

### Common Issues

1. **"Please add your Mongo URI to .env.local"**
   - Make sure `.env.local` exists and has `MONGODB_URI`

2. **Authentication fails**
   - Check that you're using Node.js 22.11.0+
   - Verify Quick Auth server is accessible
   - Check browser console for errors

3. **Database connection fails**
   - Verify MongoDB URI is correct
   - Check network connectivity
   - Ensure database user has proper permissions

4. **App shows loading screen indefinitely**
   - Make sure `sdk.actions.ready()` is called
   - Check for JavaScript errors in console

### Getting Help

- Check the [Farcaster Mini Apps documentation](https://miniapps.farcaster.xyz/)
- Review [Quick Auth documentation](https://github.com/farcasterxyz/protocol/discussions/231)
- Check MongoDB Atlas documentation for connection issues
