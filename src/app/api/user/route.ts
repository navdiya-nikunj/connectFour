import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // In a real implementation, you would validate the JWT token here
    // For now, we'll return a mock user response
    console.log(request);
    const mockUser = {
      fid: 12345,
      username: 'connectfour_player',
      displayName: 'Connect Four Player',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=connectfour'
    };

    return NextResponse.json(mockUser);
  } catch (error) {
    console.error('Error fetching user data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user data' },
      { status: 500 }
    );
  }
} 