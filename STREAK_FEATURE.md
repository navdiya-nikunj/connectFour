# 🏆 Connect Four Streak System

A comprehensive streak tracking and social sharing system for the Connect Four mini app on Farcaster.

## ✨ Features

### 🎯 Win Streak Tracking
- **Automatic Updates:** Streaks are automatically updated after each game
- **Consecutive Wins:** Tracks the number of consecutive wins
- **Streak Reset:** Streaks reset to 0 when a game is lost
- **Longest Streak:** Records the highest streak achieved

### 🏅 Achievement System
- **First Win:** Achieve your first victory
- **Streak Master:** Reach a 3-win streak
- **Fire Starter:** Reach a 5-win streak  
- **Unstoppable:** Reach a 10-win streak

### 📊 Analytics Dashboard
- **Win Rate:** Percentage of games won
- **Total Games:** Number of games played
- **Total Wins:** Number of victories
- **Last Win Date:** When you last won a game
- **Streak Start Date:** When your current streak began

### 🏆 Leaderboard System
- **Real-time Rankings:** Live leaderboard of top players
- **Multiple Metrics:** Ranked by current streak, longest streak, and win rate
- **User Profiles:** Shows avatars and usernames
- **Statistics Summary:** Overall leaderboard statistics

### 📱 Shareable Frames
- **Custom Design:** Beautiful frames optimized for Farcaster sharing
- **Dynamic Content:** Shows current streak, stats, and achievements
- **Branded Elements:** Includes app branding and call-to-action
- **Multiple Sizes:** Optimized for different social media platforms

## 🗄️ Database Schema

### UserStreak Collection
```javascript
{
  _id: ObjectId,
  fid: Number,           // Farcaster ID (unique)
  currentStreak: Number, // Current win streak
  longestStreak: Number, // Highest streak achieved
  totalWins: Number,     // Total victories
  totalGames: Number,    // Total games played
  lastWinDate: Date,     // Date of last win
  streakStartDate: Date, // When current streak started
  createdAt: Date,       // Record creation time
  updatedAt: Date        // Last update time
}
```

## 🔌 API Endpoints

### GET `/api/streak`
Get user's streak data or leaderboard.

**Query Parameters:**
- `action=leaderboard` - Get leaderboard data
- `limit=10` - Number of leaderboard entries (default: 10)

**Response:**
```json
{
  "streak": {
    "currentStreak": 5,
    "longestStreak": 8,
    "totalWins": 15,
    "totalGames": 20,
    "winRate": 75,
    "lastWinDate": "2024-01-15T10:30:00Z",
    "streakStartDate": "2024-01-10T14:20:00Z"
  }
}
```

### POST `/api/streak`
Update user's streak after a game.

**Body:**
```json
{
  "isWin": true
}
```

**Response:**
```json
{
  "streak": {
    "currentStreak": 6,
    "longestStreak": 8,
    "totalWins": 16,
    "totalGames": 21,
    "winRate": 76,
    "lastWinDate": "2024-01-15T10:30:00Z",
    "streakStartDate": "2024-01-10T14:20:00Z"
  }
}
```

## 🎨 UI Components

### StreakDisplay
Beautiful streak display with animations and progress tracking.

**Props:**
- `streak: StreakStats` - User's streak data
- `showShareButton?: boolean` - Show share button
- `onShare?: () => void` - Share callback

### StreakLeaderboard
Interactive leaderboard with user rankings and statistics.

**Props:**
- `entries: LeaderboardEntry[]` - Leaderboard data
- `className?: string` - Additional CSS classes

### StreakShareFrame
Shareable frame optimized for social media.

**Props:**
- `data: StreakShareData` - User data for the frame
- `className?: string` - Additional CSS classes

### StreakPage
Complete streak dashboard with tabs and analytics.

**Props:**
- `onBack: () => void` - Back navigation callback
- `className?: string` - Additional CSS classes

## 🛠️ Utility Functions

### streakUtils.ts
Helper functions for streak calculations and formatting.

**Functions:**
- `calculateWinRate(wins, totalGames)` - Calculate win percentage
- `getStreakColor(currentStreak)` - Get CSS gradient for streak
- `getStreakIcon(currentStreak)` - Get emoji for streak level
- `getStreakMessage(currentStreak)` - Get motivational message
- `formatDate(date)` - Format date for display
- `getAchievementProgress(streak)` - Get achievement progress
- `getStreakEmoji(currentStreak)` - Get streak emoji
- `getRankColor(rank)` - Get rank styling
- `getRankIcon(rank)` - Get rank icon

## 🎯 Achievement Milestones

| Achievement | Requirement | Icon | Description |
|-------------|-------------|------|-------------|
| First Win | 1 win | 🔥 | Achieve your first victory |
| Streak Master | 3-win streak | ⭐ | Build a solid winning streak |
| Fire Starter | 5-win streak | 🏆 | Show consistent dominance |
| Unstoppable | 10-win streak | 👑 | Reach legendary status |

## 🎨 Visual Design

### Color Schemes
- **Blue (0-2 wins):** `from-blue-500 to-purple-500`
- **Green (3-4 wins):** `from-yellow-500 to-green-500`
- **Orange (5-9 wins):** `from-orange-500 to-yellow-500`
- **Red (10+ wins):** `from-red-500 to-orange-500`

### Animations
- **Framer Motion:** Smooth transitions and micro-interactions
- **Staggered Animations:** Sequential loading of elements
- **Hover Effects:** Interactive feedback on buttons
- **Progress Bars:** Animated achievement progress

### Responsive Design
- **Mobile First:** Optimized for mobile devices
- **Tablet Support:** Enhanced layout for tablets
- **Desktop Experience:** Full-featured desktop interface
- **Touch Friendly:** Large touch targets and gestures

## 🔄 Integration

### Automatic Updates
Streaks are automatically updated when games are saved via the `/api/game-history` endpoint.

### Game Flow
1. User plays a game
2. Game result is saved to database
3. Streak is automatically updated
4. User can view updated stats in streak dashboard
5. User can share their achievement on Farcaster

### Error Handling
- **Network Errors:** Graceful fallback for API failures
- **Loading States:** Spinner and skeleton screens
- **Empty States:** Helpful messages when no data
- **Validation:** Input validation and error messages

## 🚀 Performance

### Optimizations
- **Lazy Loading:** Components load on demand
- **Caching:** API responses cached locally
- **Debouncing:** Search and filter inputs
- **Virtual Scrolling:** Large lists optimized

### Database Indexes
```javascript
// Recommended indexes for performance
db.userstreaks.createIndex({ "fid": 1 }, { unique: true })
db.userstreaks.createIndex({ "currentStreak": -1 })
db.userstreaks.createIndex({ "longestStreak": -1 })
db.userstreaks.createIndex({ "totalWins": -1 })
```

## 🧪 Testing

### Unit Tests
- Streak calculation functions
- Utility functions
- Component rendering

### Integration Tests
- API endpoint responses
- Database operations
- Authentication flow

### E2E Tests
- Complete user journey
- Streak updates
- Share functionality

## 📈 Analytics

### Metrics Tracked
- **Streak Distribution:** How many users have each streak level
- **Achievement Completion:** Percentage of users with each achievement
- **Share Rate:** How often users share their streaks
- **Engagement:** Time spent on streak dashboard

### Insights
- **Popular Streaks:** Most common streak levels
- **Drop-off Points:** Where users lose streaks most
- **Retention:** How streaks affect user retention
- **Social Impact:** Viral sharing patterns

## 🔮 Future Enhancements

### Planned Features
- **Streak Multipliers:** Bonus points for longer streaks
- **Seasonal Events:** Special streak challenges
- **Team Streaks:** Group streak tracking
- **Streak Rewards:** Unlockable content and badges

### Technical Improvements
- **Real-time Updates:** WebSocket integration
- **Offline Support:** PWA capabilities
- **Push Notifications:** Streak reminders
- **Advanced Analytics:** Machine learning insights

## 🤝 Contributing

### Development Setup
1. Clone the repository
2. Install dependencies: `npm install`
3. Set up environment variables
4. Start development server: `npm run dev`

### Code Style
- **TypeScript:** Strict type checking
- **ESLint:** Code quality enforcement
- **Prettier:** Consistent formatting
- **Husky:** Pre-commit hooks

### Testing
- **Jest:** Unit and integration tests
- **Cypress:** End-to-end tests
- **Storybook:** Component documentation

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- **Farcaster Team:** For the amazing platform
- **MongoDB:** For the robust database solution
- **Framer Motion:** For the beautiful animations
- **Lucide Icons:** For the consistent iconography
