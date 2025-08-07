import { NextRequest, NextResponse } from 'next/server';
import { validateQuickAuthToken } from '@/utils/auth';
import { saveGameHistory, getGameHistoryByUser, IGameHistory } from '@/utils/mongodb';

export async function POST(request: NextRequest) {
  try {
    // Validate Quick Auth token
    const authenticatedUser = await validateQuickAuthToken(request);
    
    if (!authenticatedUser) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { gameMode, aiDifficulty, winner, players, moves, duration } = body;

    // Validate required fields
    if (!gameMode || !winner || !players || !moves || typeof duration !== 'number') {
      return NextResponse.json(
        { error: 'Invalid request data' },
        { status: 400 }
      );
    }

    // Save game history to database
    const gameHistory = await saveGameHistory({
      gameMode,
      aiDifficulty,
      winner,
      players,
      moves,
      duration,
    });

    return NextResponse.json({ gameHistory });
  } catch (error) {
    console.error('Error saving game history:', error);
    return NextResponse.json(
      { error: 'Failed to save game history' },
      { status: 500 }
    );
  }
}

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
    const limit = parseInt(searchParams.get('limit') || '10');

    // Get game history for the authenticated user
    const gameHistory = await getGameHistoryByUser(authenticatedUser.fid, limit);

    return NextResponse.json({ gameHistory });
  } catch (error) {
    console.error('Error fetching game history:', error);
    return NextResponse.json(
      { error: 'Failed to fetch game history' },
      { status: 500 }
    );
  }
}
