# Connect Four Farcaster Mini App - Setup Guide

## 🚀 Quick Start

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd connect-for
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file with:
   ```env
   MONGODB_URI=your_mongodb_connection_string
   NEYNAR_API_KEY=your_neynar_api_key
   HOSTNAME=localhost:3000
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:3000`

## 📊 Streak System Features

### 24-Hour Streak Logic
The streak system implements a 24-hour period tracking:

- **Streak Continuation**: If a user wins within 24 hours of their last win, the streak continues
- **Streak Reset**: If more than 24 hours pass since the last win, a new streak starts at 1
- **Loss Handling**: Losses don't immediately reset streaks - they only reset if 24 hours pass without a win
- **Automatic Cleanup**: Expired streaks are automatically reset when users view their streak data

### Streak Tracking
- **Current Streak**: Number of consecutive wins within 24-hour periods
- **Longest Streak**: Highest streak achieved (never resets)
- **Total Wins**: Total number of games won
- **Total Games**: Total number of games played
- **Win Rate**: Percentage of games won
- **Last Win Date**: Timestamp of the most recent win
- **Streak Start Date**: When the current streak began

### Database Collections

#### `users`
Stores Farcaster user information:
```javascript
{
  fid: Number,           // Farcaster ID
  username: String,      // Farcaster username
  displayName: String,   // Display name
  avatar: String,        // Profile picture URL
  primaryAddress: String, // Wallet address
  createdAt: Date,
  updatedAt: Date
}
```

#### `gamehistory`
Stores completed game data:
```javascript
{
  gameMode: String,      // 'local', 'ai', 'multiplayer'
  aiDifficulty: String,  // 'easy', 'medium', 'hard' (for AI games)
  winner: String,        // 'red', 'yellow', 'draw'
  players: {
    red: { fid, username, displayName, avatar },
    yellow: { fid, username, displayName, avatar }
  },
  moves: Array,          // Game moves with timestamps
  duration: Number,      // Game duration in seconds
  createdAt: Date,
  updatedAt: Date
}
```

#### `userstreaks`
Stores user streak data:
```javascript
{
  fid: Number,           // Farcaster ID
  currentStreak: Number, // Current 24-hour streak
  longestStreak: Number, // Best streak ever achieved
  totalWins: Number,     // Total games won
  totalGames: Number,    // Total games played
  lastWinDate: Date,     // Last win timestamp
  streakStartDate: Date, // When current streak started
  createdAt: Date,
  updatedAt: Date
}
```

## 🔌 API Endpoints

### `/api/user`
- **GET**: Fetch authenticated user data
- **Authentication**: Required (Quick Auth token)

### `/api/game-history`
- **POST**: Save completed game data
- **GET**: Fetch user's game history
- **Authentication**: Required (Quick Auth token)

### `/api/streak`
- **GET**: Fetch user streak data or leaderboard
  - `?action=leaderboard&limit=10`: Get top streaks
  - `?action=cleanup`: Clean up expired streaks (admin)
  - Default: Get current user's streak
- **POST**: Update streak after game
  - Body: `{ "isWin": boolean }`
- **Authentication**: Required (Quick Auth token)

## 🎮 Streak System Features

### Achievements & Milestones
- **First Win**: Start your streak journey
- **3-Day Streak**: Consistent daily wins
- **7-Day Streak**: Weekly warrior
- **14-Day Streak**: Fortnight fighter
- **30-Day Streak**: Monthly master
- **100-Day Streak**: Century champion

### Tracking & Analytics
- Real-time streak updates
- Win rate calculations
- Historical performance data
- Streak duration tracking
- Achievement progress

### Shareable Frames
- Custom streak sharing frames
- Social media integration
- Achievement celebration
- Leaderboard highlights

### Leaderboard System
- Top current streaks
- Best historical streaks
- Win rate rankings
- Community competition

## 🛠️ Development Tips

### Testing Streak Functionality
1. **Manual Testing**:
   ```bash
   # Test streak cleanup
   curl -H "Authorization: Bearer YOUR_TOKEN" \
        "http://localhost:3000/api/streak?action=cleanup"
   
   # Test user streak
   curl -H "Authorization: Bearer YOUR_TOKEN" \
        "http://localhost:3000/api/streak"
   ```

2. **Database Testing**:
   ```javascript
   // Connect to MongoDB and test streak data
   db.userstreaks.find({ fid: YOUR_FID })
   ```

3. **Simulate 24-hour periods**:
   - Play games and win
   - Wait 24+ hours
   - Check if streak resets
   - Verify new streak starts at 1

### Streak Testing Scenarios
- **New User**: First win should start streak at 1
- **Same Day Wins**: Multiple wins should increment streak
- **Next Day Win**: Should continue streak if within 24 hours
- **Expired Streak**: Should reset to 1 if >24 hours passed
- **Loss Handling**: Losses shouldn't reset streak immediately

## 🔧 Troubleshooting

### Streak Issues
- **Streaks not updating**: Check if `updateStreakAfterGame` is called in game history API
- **Expired streaks not resetting**: Verify `getUserStreak` includes expiration check
- **Wrong streak counts**: Ensure 24-hour logic is working correctly

### Database Issues
- **Connection errors**: Check MongoDB URI in environment variables
- **Schema validation**: Ensure all required fields are present
- **Index performance**: Add indexes for frequent queries

### API Issues
- **Authentication errors**: Verify Quick Auth token is valid
- **CORS issues**: Check Next.js API configuration
- **Rate limiting**: Monitor API usage patterns

## 🚀 Production Deployment

### Environment Variables
```env
MONGODB_URI=mongodb+srv://...
NEYNAR_API_KEY=your_production_key
HOSTNAME=your-domain.com
NODE_ENV=production
```

### Database Setup
1. Create MongoDB Atlas cluster
2. Set up database indexes for performance
3. Configure backup and monitoring
4. Set up connection pooling

### Monitoring
- Track streak system performance
- Monitor API response times
- Set up error alerting
- Monitor database usage

## 📈 Future Enhancements

### Planned Features
- **Streak Multipliers**: Bonus points for longer streaks
- **Seasonal Events**: Special streak challenges
- **Social Features**: Streak sharing and challenges
- **Analytics Dashboard**: Detailed performance metrics
- **Achievement Badges**: Visual streak milestones
- **Push Notifications**: Streak reminders and alerts

### Technical Improvements
- **Caching**: Redis for streak data
- **Background Jobs**: Automated streak cleanup
- **Real-time Updates**: WebSocket for live streak changes
- **Mobile Optimization**: Progressive Web App features
