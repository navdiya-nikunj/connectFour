import { NextRequest, NextResponse } from 'next/server';
import { updateGameState, getInitialGameState } from '@/utils/gameLogic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { gameState, column } = body;

    if (!gameState || typeof column !== 'number') {
      return NextResponse.json(
        { error: 'Invalid request data' },
        { status: 400 }
      );
    }

    const newGameState = updateGameState(gameState, column);
    
    return NextResponse.json({ gameState: newGameState });
  } catch (error) {
    console.error('Game API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const initialGameState = getInitialGameState();
    return NextResponse.json({ gameState: initialGameState });
  } catch (error) {
    console.error('Game API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 