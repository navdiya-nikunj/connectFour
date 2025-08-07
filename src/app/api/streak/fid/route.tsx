import { ImageResponse } from 'next/og';
import { getUserByFid, getUserStreak } from '@/utils/mongodb';
import { calculateWinRate } from '@/utils/streakUtils';

function getStreakIcon(currentStreak: number): string {
  if (currentStreak >= 10) return '👑';
  if (currentStreak >= 5) return '🏆';
  if (currentStreak >= 3) return '⭐';
  return '🔥';
}

function getStreakMessage(currentStreak: number): string {
  if (currentStreak >= 10) return "🔥 UNSTOPPABLE! 🔥";
  if (currentStreak >= 5) return "⚡ On Fire! ⚡";
  if (currentStreak >= 3) return "🚀 Rising Star! 🚀";
  return "🎯 Getting Started! 🎯";
}

function getStreakColor(currentStreak: number): string {
  if (currentStreak >= 10) return 'linear-gradient(135deg, #ff6b6b 0%, #ffa726 50%, #ff6b6b 100%)';
  if (currentStreak >= 5) return 'linear-gradient(135deg, #ffa726 0%, #ffeb3b 50%, #ffa726 100%)';
  if (currentStreak >= 3) return 'linear-gradient(135deg, #ffeb3b 0%, #4caf50 50%, #ffeb3b 100%)';
  return 'linear-gradient(135deg, #2196f3 0%, #9c27b0 50%, #2196f3 100%)';
}

export async function GET(request: Request) {
  try {
    console.log('request', request);
    const { searchParams } = new URL(request.url);
    const fid = searchParams.get('fid') ?? '0';
    const fidNumber = parseInt(fid, 10);
    console.log('fidNumber', fidNumber);
    
    // Fetch user data
    const user = await getUserByFid(fidNumber);
    const streak = await getUserStreak(fidNumber);

    if (!user || !streak) {
      return new ImageResponse(
        (
          <div style={{
            width: '1200px',
            height: '630px',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ffffff',
            fontFamily: 'Inter',
            position: 'relative',
            overflow: 'hidden',
          }}>
            {/* Background Pattern */}
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              opacity: 0.1,
              background: 'radial-gradient(circle at 20% 80%, rgba(255,255,255,0.3) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255,255,255,0.3) 0%, transparent 50%)',
              display: 'flex',
            }} />
            
            <div style={{ 
              fontSize: '64px', 
              fontWeight: 700, 
              display: 'flex', 
              justifyContent: 'center',
              marginBottom: '16px',
              textShadow: '0 4px 8px rgba(0,0,0,0.3)',
            }}>
              Connect Four
            </div>
            <div style={{ 
              fontSize: '32px', 
              opacity: 0.9, 
              display: 'flex', 
              justifyContent: 'center',
              fontWeight: 500,
            }}>
              User not found
            </div>
          </div>
        ),
        {
          width: 1200,
          height: 630,
          headers: {
            'Cache-Control': 'no-cache, no-store, must-revalidate'
          },
        }
      );
    }

    const winRate = calculateWinRate(streak.totalWins, streak.totalGames);
    const streakIcon = getStreakIcon(streak.currentStreak);
    const streakMessage = getStreakMessage(streak.currentStreak);
    const streakColor = getStreakColor(streak.currentStreak);

    return new ImageResponse(
      (
        <div style={{
          width: '1200px',
          height: '630px',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#ffffff',
          fontFamily: 'Inter',
          position: 'relative',
          overflow: 'hidden',
        }}>
          {/* Background Pattern */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            opacity: 0.1,
            background: 'radial-gradient(circle at 20% 80%, rgba(255,255,255,0.3) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255,255,255,0.3) 0%, transparent 50%)',
            display: 'flex',
          }} />

          {/* Header */}
          <div style={{ 
            fontSize: '56px', 
            fontWeight: 700, 
            marginBottom: '12px', 
            display: 'flex', 
            justifyContent: 'center',
            textShadow: '0 4px 8px rgba(0,0,0,0.3)',
          }}>
            Connect Four
          </div>
          
          
          {/* User Info */}
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '20px',
            marginBottom: '40px',
          }}>
            <div style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              border: '4px solid rgba(255, 255, 255, 0.3)',
              background: 'rgba(255, 255, 255, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '32px',
            }}>
              {user.avatar ? '👤' : '🎮'}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{ 
                fontSize: '32px', 
                marginBottom: '8px', 
                display: 'flex', 
                justifyContent: 'center',
                fontWeight: 700,
                textShadow: '0 2px 4px rgba(0,0,0,0.3)',
              }}>
                {user.displayName || `User ${fid}`}
              </div>
              <div style={{ 
                fontSize: '20px', 
                display: 'flex', 
                justifyContent: 'center',
                opacity: 0.8,
              }}>
                @{user.username || `user${fid}`}
              </div>
            </div>
          </div>
          
          {/* Streak Card */}
          <div style={{
            background: streakColor,
            borderRadius: '32px',
            padding: '40px',
            textAlign: 'center',
            marginBottom: '40px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)',
            border: '2px solid rgba(255, 255, 255, 0.2)',
            minWidth: '400px',
          }}>
            <div style={{ 
              fontSize: '120px', 
              fontWeight: 700, 
              marginBottom: '16px', 
              display: 'flex', 
              justifyContent: 'center',
              lineHeight: '1',
            }}>
              {streakIcon} {streak.currentStreak}
            </div>
            <div style={{ 
              fontSize: '28px', 
              marginBottom: '16px', 
              display: 'flex', 
              justifyContent: 'center',
              fontWeight: 600,
            }}>
              {streak.currentStreak === 1 ? 'win' : 'wins'} in a row
            </div>
            <div style={{ 
              fontSize: '24px', 
              fontWeight: 600, 
              display: 'flex', 
              justifyContent: 'center',
              textShadow: '0 2px 4px rgba(0,0,0,0.3)',
            }}>
              {streakMessage}
            </div>
          </div>
          
          {/* Stats Row */}
          <div style={{ 
            display: 'flex', 
            gap: '80px',
            justifyContent: 'center',
          }}>
            <div style={{ 
              textAlign: 'center', 
              display: 'flex', 
              flexDirection: 'column',
              alignItems: 'center',
            }}>
              <div style={{ 
                fontSize: '48px', 
                fontWeight: 700, 
                display: 'flex', 
                justifyContent: 'center',
                marginBottom: '8px',
                textShadow: '0 2px 4px rgba(0,0,0,0.3)',
              }}>
                {streak.longestStreak}
              </div>
              <div style={{ 
                fontSize: '16px', 
                display: 'flex', 
                justifyContent: 'center',
                opacity: 0.8,
                fontWeight: 500,
              }}>
                Best Streak
              </div>
            </div>
            <div style={{ 
              textAlign: 'center', 
              display: 'flex', 
              flexDirection: 'column',
              alignItems: 'center',
            }}>
              <div style={{ 
                fontSize: '48px', 
                fontWeight: 700, 
                display: 'flex', 
                justifyContent: 'center',
                marginBottom: '8px',
                textShadow: '0 2px 4px rgba(0,0,0,0.3)',
              }}>
                {streak.totalWins}
              </div>
              <div style={{ 
                fontSize: '16px', 
                display: 'flex', 
                justifyContent: 'center',
                opacity: 0.8,
                fontWeight: 500,
              }}>
                Total Wins
              </div>
            </div>
            <div style={{ 
              textAlign: 'center', 
              display: 'flex', 
              flexDirection: 'column',
              alignItems: 'center',
            }}>
              <div style={{ 
                fontSize: '48px', 
                fontWeight: 700, 
                display: 'flex', 
                justifyContent: 'center',
                marginBottom: '8px',
                textShadow: '0 2px 4px rgba(0,0,0,0.3)',
              }}>
                {winRate}%
              </div>
              <div style={{ 
                fontSize: '16px', 
                display: 'flex', 
                justifyContent: 'center',
                opacity: 0.8,
                fontWeight: 500,
              }}>
                Win Rate
              </div>
            </div>
          </div>

          {/* Footer */}
          <div style={{
            position: 'absolute',
            bottom: '32px',
            left: '32px',
            right: '32px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            color: 'rgba(255, 255, 255, 0.8)',
          }}>
            <div style={{
              fontFamily: 'Inter',
              fontSize: '18px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}>
              📈 Play Connect Four on Farcaster
            </div>
            <div style={{
              fontFamily: 'Inter',
              fontSize: '14px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-end',
            }}>
              <div style={{ fontSize: '12px', opacity: 0.7 }}>Powered by</div>
              <div style={{ fontWeight: 700 }}>Connect Four Mini App</div>
            </div>
          </div>

          {/* Decorative Elements */}
          <div style={{
            position: 'absolute',
            top: '32px',
            right: '32px',
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '32px',
            border: '2px solid rgba(255, 255, 255, 0.2)',
          }}>
            🏆
          </div>
          <div style={{
            position: 'absolute',
            bottom: '32px',
            right: '120px',
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '24px',
            border: '2px solid rgba(255, 255, 255, 0.2)',
          }}>
            ⭐
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate'
        },
      }
    );
  } catch (e: unknown) {
    console.log(`${e instanceof Error ? e.message : 'Unknown error'}`);
    return new Response(`Failed to generate the image`, {
      status: 500,
    });
  }
}
