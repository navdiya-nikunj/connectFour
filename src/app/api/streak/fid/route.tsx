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
   
    const { searchParams } = new URL(request.url);
    const fid = searchParams.get('fid') ?? '0';
    const fidNumber = parseInt(fid, 10);
    console.log('fidNumber', fidNumber);
    
    // Fetch user data
    const user = await getUserByFid(fidNumber);
    const streak = await getUserStreak(fidNumber);
    const baseUrl = 'https://connect-four-hazel.vercel.app' ;

    if (!user || !streak) {
      return new ImageResponse(
        (
          <div style={{
            width: '1000px',
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
          width: '100%',
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

          {/* Header Section */}
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            width: '100%',
            padding: '32px 48px',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
          }}>
            {/* Logo */}
            <div style={{ 
              display: 'flex', 
              alignItems: 'center',
              background: 'rgba(255,255,255,0.15)',
              borderRadius: '16px',
              padding: '12px 20px',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.2)',
            }}>
              <img src={`${baseUrl}/logo.png`} width={40} height={40} style={{ marginRight: '12px' }} />
              <div style={{ 
                fontSize: '24px', 
                fontWeight: 700,
                display: 'flex',
              }}>
                Connect Four
              </div>
            </div>

            {/* Decorative Trophy */}
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              background: 'rgba(255, 255, 255, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '24px',
              border: '2px solid rgba(255, 255, 255, 0.3)',
              backdropFilter: 'blur(10px)',
            }}>
              🏆
            </div>
          </div>
          
          {/* Main Content */}
          <div style={{ 
            display: 'flex', 
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            padding: '120px 48px 80px 48px',
          }}>
            {/* User Info */}
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '24px',
              marginBottom: '48px',
              background: 'rgba(255,255,255,0.1)',
              borderRadius: '24px',
              padding: '24px 32px',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.2)',
            }}>
              <div style={{
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                border: '4px solid rgba(255, 255, 255, 0.3)',
                background: 'rgba(255, 255, 255, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '32px',
                backdropFilter: 'blur(10px)',
              }}>
                {user.avatar ? '👤' : '🎮'}
              </div>
              <div style={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'flex-start',
                gap: '8px',
              }}>
                <div style={{ 
                  fontSize: '36px', 
                  fontWeight: 700,
                  textShadow: '0 2px 4px rgba(0,0,0,0.3)',
                  display: 'flex',
                }}>
                  {user.displayName || `User ${fid}`}
                </div>
                <div style={{ 
                  fontSize: '20px', 
                  opacity: 0.8,
                  display: 'flex',
                }}>
                  @{user.username || `user${fid}`}
                </div>
              </div>
            </div>
            
            {/* Streak Card */}
            <div style={{
              background: streakColor,
              borderRadius: '32px',
              padding: '48px',
              textAlign: 'center',
              marginBottom: '126px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)',
              border: '2px solid rgba(255, 255, 255, 0.2)',
              minWidth: '500px',
              position: 'relative',
              overflow: 'hidden',
            }}>
              {/* Streak Card Background Pattern */}
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                opacity: 0.1,
                background: 'radial-gradient(circle at 30% 70%, rgba(255,255,255,0.4) 0%, transparent 50%)',
                display: 'flex',
              }} />
              
              <div style={{ 
                fontSize: '120px', 
                fontWeight: 700, 
                marginBottom: '16px', 
                display: 'flex', 
                justifyContent: 'center',
                lineHeight: '1',
                position: 'relative',
                zIndex: 1,
              }}>
                {streakIcon} {streak.currentStreak}
              </div>
              <div style={{ 
                fontSize: '28px', 
                marginBottom: '16px', 
                display: 'flex', 
                justifyContent: 'center',
                fontWeight: 600,
                position: 'relative',
                zIndex: 1,
              }}>
                {streak.currentStreak === 1 ? 'win' : 'wins'} in a row
              </div>
              <div style={{ 
                fontSize: '24px', 
                fontWeight: 600, 
                display: 'flex', 
                justifyContent: 'center',
                textShadow: '0 2px 4px rgba(0,0,0,0.3)',
                position: 'relative',
                zIndex: 1,
              }}>
                {streakMessage}
              </div>
            </div>
            
            {/* Stats Row
            <div style={{ 
              display: 'flex', 
              gap: '80px',
              justifyContent: 'center',
              background: 'rgba(255,255,255,0.1)',
              borderRadius: '24px',
              padding: '32px 48px',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.2)',
            }}>
              <div style={{ 
                textAlign: 'center', 
                display: 'flex', 
                flexDirection: 'column',
                alignItems: 'center',
                gap: '8px',
              }}>
                <div style={{ 
                  fontSize: '48px', 
                  fontWeight: 700, 
                  display: 'flex', 
                  justifyContent: 'center',
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
                gap: '8px',
              }}>
                <div style={{ 
                  fontSize: '48px', 
                  fontWeight: 700, 
                  display: 'flex', 
                  justifyContent: 'center',
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
                gap: '8px',
              }}>
                <div style={{ 
                  fontSize: '48px', 
                  fontWeight: 700, 
                  display: 'flex', 
                  justifyContent: 'center',
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
            </div>*/}
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
              background: 'rgba(255,255,255,0.1)',
              padding: '12px 20px',
              borderRadius: '12px',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.2)',
            }}>
              📈 Play Connect Four on Farcaster
            </div>
            <div style={{
              fontFamily: 'Inter',
              fontSize: '14px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-end',
              background: 'rgba(255,255,255,0.1)',
              padding: '12px 20px',
              borderRadius: '12px',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.2)',
            }}>
              <div style={{ 
                fontSize: '12px', 
                opacity: 0.7,
                display: 'flex',
              }}>
                Powered by
              </div>
              <div style={{ 
                fontWeight: 700,
                display: 'flex',
              }}>
                Connect Four Mini App
              </div>
            </div>
          </div>

          {/* Decorative Elements */}
          <div style={{
            position: 'absolute',
            top: '120px',
            right: '48px',
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '32px',
            border: '2px solid rgba(255, 255, 255, 0.3)',
            backdropFilter: 'blur(10px)',
          }}>
            ⭐
          </div>
          <div style={{
            position: 'absolute',
            bottom: '120px',
            right: '48px',
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '24px',
            border: '2px solid rgba(255, 255, 255, 0.3)',
            backdropFilter: 'blur(10px)',
          }}>
            🔥
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
