import { NextRequest, NextResponse } from 'next/server';
import { validateQuickAuthToken } from '@/utils/auth';
import { createOrUpdateUser, getUserByFid, IUser } from '@/utils/mongodb';

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

    // Check if user exists in database
    let user = await getUserByFid(authenticatedUser.fid);
    
    if (!user) {
      // Fetch user data from Farcaster API
      const farcasterUser = await fetchFarcasterUser(authenticatedUser.fid);
      
      // Create new user in database
      user = await createOrUpdateUser({
        fid: authenticatedUser.fid,
        username: farcasterUser.username,
        displayName: farcasterUser.displayName,
        avatar: farcasterUser.avatar,
        primaryAddress: authenticatedUser.primaryAddress,
      });
    } else {
      // Update user's primary address if it changed
      if (authenticatedUser.primaryAddress && user.primaryAddress !== authenticatedUser.primaryAddress) {
        user = await createOrUpdateUser({
          ...user,
          primaryAddress: authenticatedUser.primaryAddress,
        });
      }
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error('Error fetching user data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user data' },
      { status: 500 }
    );
  }
}

async function fetchFarcasterUser(fid: number) {
  try {
    // Fetch user data from Neynar API (requires API key)
    const NEYNAR_API_KEY = process.env.NEYNAR_API_KEY;
    const response = await fetch(`https://api.neynar.com/v2/farcaster/user/bulk?fids=${fid}`, {
      headers: {
        'accept': 'application/json',
        'api_key': NEYNAR_API_KEY || '',
      },
    });
    
    if (response.ok) {
      const data = await response.json() as {
        users: Array<{
          fid: number;
          username?: string;
          display_name?: string;
          pfp_url?: string;
        }>;
      };

      const user = data.users && data.users[0];
   
      if (user) {
        return {
          username: user.username,
          displayName: user.display_name,
          avatar: user.pfp_url,
        };
      }
    }
  } catch (error) {
    console.error('Error fetching Farcaster user:', error);
  }
  
  // Return fallback data if API call fails
  return {
    username: undefined,
    displayName: `User ${fid}`,
    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${fid}`,
  };
} 