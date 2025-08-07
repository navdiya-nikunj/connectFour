import { NextRequest, NextResponse } from 'next/server';
import { validateQuickAuthToken } from '@/utils/auth';
import { getUserStreak, getTopStreaks, updateStreakAfterGame, getUserByFid, checkAndResetExpiredStreaks } from '@/utils/mongodb';

export async function GET(request: NextRequest) {
  try {
    // Validate Quick Auth token
    const authenticatedUser = await validateQuickAuthToken(request);
    
    if (!authenticatedUser) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');

    if (action === 'leaderboard') {
      // Get top streaks for leaderboard
      const limit = parseInt(searchParams.get('limit') || '10');
      const topStreaks = await getTopStreaks(limit);
      
      // Enrich with user data
      const enrichedStreaks = await Promise.all(
        topStreaks.map(async (streak) => {
          const user = await getUserByFid(streak.fid);
          return {
            ...streak,
            username: user?.username || 'Unknown',
            displayName: user?.displayName || 'Unknown',
            avatar: user?.avatar || '',
            winRate: streak.totalGames > 0 ? Math.round((streak.totalWins / streak.totalGames) * 100) : 0
          };
        })
      );

      return NextResponse.json({ streaks: enrichedStreaks });
    } else if (action === 'cleanup') {
      // Admin endpoint to clean up expired streaks
      await checkAndResetExpiredStreaks();
      return NextResponse.json({ message: 'Expired streaks cleaned up successfully' });
    } else {
      // Get user's own streak (this will automatically check and reset expired streaks)
      const userStreak = await getUserStreak(authenticatedUser.fid);
      
      if (!userStreak) {
        return NextResponse.json({
          streak: {
            fid: authenticatedUser.fid,
            username: undefined,
            displayName: undefined,
            avatar: undefined,
            currentStreak: 0,
            longestStreak: 0,
            totalWins: 0,
            totalGames: 0,
            winRate: 0,
            lastWinDate: null,
            streakStartDate: null
          }
        });
      }

      // Get user data to enrich streak response
      const user = await getUserByFid(authenticatedUser.fid);
      const winRate = userStreak.totalGames > 0 ? Math.round((userStreak.totalWins / userStreak.totalGames) * 100) : 0;

      return NextResponse.json({
        streak: {
          ...userStreak,
          username: user?.username,
          displayName: user?.displayName,
          avatar: user?.avatar,
          winRate
        }
      });
    }
  } catch (error) {
    console.error('Error fetching streak data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch streak data' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Validate Quick Auth token
    const authenticatedUser = await validateQuickAuthToken(request);
    console.log('authenticatedUser', authenticatedUser);
    if (!authenticatedUser) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { isWin } = body;

    if (typeof isWin !== 'boolean') {
      return NextResponse.json(
        { error: 'Invalid request data' },
        { status: 400 }
      );
    }

    // Update streak after game
    const updatedStreak = await updateStreakAfterGame(authenticatedUser.fid, isWin);
    
    const winRate = updatedStreak.totalGames > 0 ? Math.round((updatedStreak.totalWins / updatedStreak.totalGames) * 100) : 0;

    return NextResponse.json({
      streak: {
        ...updatedStreak,
        winRate
      }
    });
  } catch (error) {
    console.error('Error updating streak:', error);
    return NextResponse.json(
      { error: 'Failed to update streak' },
      { status: 500 }
    );
  }
}
