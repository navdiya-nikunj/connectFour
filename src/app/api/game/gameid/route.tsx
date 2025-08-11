import { ImageResponse } from 'next/og';
import { getGameHistoryById } from '@/utils/mongodb';
import { createEmptyBoard, getLowestEmptyRow, checkWin, DEFAULT_SETTINGS } from '@/utils/gameLogic';
import type { Player } from '@/types/game';

function titleCase(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function getWinnerLabel(opts: {
  gameMode: 'local' | 'ai' | 'multiplayer';
  winner: 'red' | 'yellow' | 'draw';
  players: {
    red: { fid: number; username?: string; displayName?: string };
    yellow: { fid: number; username?: string; displayName?: string };
  };
}): string {
  const { gameMode, winner, players } = opts;
  if (winner === 'draw') return 'Draw';
  const winnerInfo = players[winner];
  if (gameMode === 'ai' && winnerInfo.fid === 0) return 'AI';
  if (winnerInfo.fid === 0) return 'Guest User';
  return winnerInfo.displayName || winnerInfo.username || `FID ${winnerInfo.fid}`;
}

function buildBoardFromMoves(moves: Array<{ column: number; player: 'red' | 'yellow' }>): Player[][] {
  const board = createEmptyBoard(DEFAULT_SETTINGS.rows, DEFAULT_SETTINGS.cols);
  for (const move of moves) {
    const row = getLowestEmptyRow(board, move.column);
    if (row !== -1) {
      board[row][move.column] = move.player as Player;
    }
  }
  return board;
}

function buildMoveIndexBoard(moves: Array<{ column: number; player: 'red' | 'yellow' }>): (number | null)[][] {
  const occupancy = createEmptyBoard(DEFAULT_SETTINGS.rows, DEFAULT_SETTINGS.cols);
  const indices: (number | null)[][] = Array.from({ length: DEFAULT_SETTINGS.rows }, () => Array(DEFAULT_SETTINGS.cols).fill(null));
  for (let i = 0; i < moves.length; i++) {
    const { column, player } = moves[i];
    const row = getLowestEmptyRow(occupancy, column);
    if (row !== -1) {
      occupancy[row][column] = player as Player;
      indices[row][column] = i; // 0-based move index
    }
  }
  return indices;
}

function computeWinningCells(board: Player[][], moves: Array<{ column: number; player: 'red' | 'yellow' }>): [number, number][] {
  if (moves.length === 0) return [];
  const lastMove = moves[moves.length - 1];
  // Find the row where last disc landed
  let rowFound = -1;
  for (let r = 0; r < board.length; r++) {
    if (board[r][lastMove.column] !== null) {
      rowFound = r;
      break;
    }
  }
  if (rowFound === -1) return [];
  const [hasWon, winningCells] = checkWin(board, rowFound, lastMove.column, lastMove.player as Player);
  return hasWon ? winningCells : [];
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const gameId = searchParams.get('gameid') ?? '';
    const baseUrl = 'https://connect-four-hazel.vercel.app';

    if (!gameId) {
      return new ImageResponse(
        (
          <div style={{
            width: '100%',
            height: '630px',
            background: '#ffffff',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#111111',
            fontFamily: 'Inter',
            position: 'relative',
            overflow: 'hidden',
          }}>
            <div style={{ display: 'flex', fontSize: '56px', fontWeight: 800, marginBottom: '8px' }}>Connect Four</div>
            <div style={{ display: 'flex', fontSize: '28px', opacity: 0.9 }}>Missing gameid</div>
          </div>
        ),
        { width: 1200, height: 630 }
      );
    }

    const game = await getGameHistoryById(gameId);

    if (!game) {
      return new ImageResponse(
        (
          <div style={{
            width: '100%',
            height: '630px',
            background: '#ffffff',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#111111',
            fontFamily: 'Inter',
            position: 'relative',
            overflow: 'hidden',
          }}>
            <div style={{ display: 'flex', fontSize: '56px', fontWeight: 800, marginBottom: '8px' }}>Connect Four</div>
            <div style={{ display: 'flex', fontSize: '28px', opacity: 0.9 }}>Game not found</div>
          </div>
        ),
        { width: 1200, height: 630 }
      );
    }

    // Build board from moves and compute winning cells
    const board = buildBoardFromMoves(game.moves);
    const winningCells = computeWinningCells(board, game.moves);
    const moveIndexBoard = buildMoveIndexBoard(game.moves);

    const winnerLabel = game.winner === 'draw' ? 'Draw' : getWinnerLabel({
      gameMode: game.gameMode,
      winner: game.winner,
      players: game.players,
    });

    const modeLabel = titleCase(game.gameMode);
    const difficultyLabel = game.gameMode === 'ai' && game.aiDifficulty ? titleCase(game.aiDifficulty) : '-';

    return new ImageResponse(
      (
        <div style={{
          width: '100%',
          height: '630px',
          background: '#ffffff',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#111111',
          fontFamily: 'Inter',
          position: 'relative',
          overflow: 'hidden',
        }}>
          {/* Header */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            width: '100%', padding: '28px 40px', position: 'absolute', top: 0, left: 0, right: 0,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', background: '#ffffff',
              borderRadius: '16px', padding: '10px 16px', border: '1px solid #e5e7eb' }}>
              <img src={`${baseUrl}/logo.png`} width={36} height={36} alt="logo" style={{ marginRight: '10px' }} />
              <div style={{ display: 'flex', fontSize: '22px', fontWeight: 700 }}>Connect Four</div>
            </div>
            <div style={{ display: 'flex', fontSize: '18px', opacity: 0.85 }}>Game #{(game._id).toString().slice(-6)}</div>
          </div>

          {/* Main */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', paddingTop: '96px' }}>
            {/* Board */}
            <div style={{
              display: 'flex',
              background: '#ffffff',
              borderRadius: '24px',
              padding: '20px',
              border: '1px solid #e5e7eb'
            }}>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                {board.map((row, rIndex) => (
                  <div key={`row-${rIndex}`} style={{ display: 'flex', marginBottom: rIndex < board.length - 1 ? '12px' : '0px' }}>
                    {row.map((cell, cIndex) => {
                      const isWinning = winningCells.some(([wr, wc]) => wr === rIndex && wc === cIndex);
                      const moveIndex = moveIndexBoard[rIndex][cIndex];
                      const bg = moveIndex === null ? 'transparent' : (moveIndex % 2 === 0 ? '#ec4899' : '#3b82f6');
                      return (
                        <div key={`${rIndex}-${cIndex}`} style={{
                          display: 'flex',
                          width: '64px', height: '64px', borderRadius: '50%',
                          background: bg,
                          border: moveIndex !== null ? '2px solid rgba(17,17,17,0.2)' : '2px solid rgba(17,17,17,0.12)',
                          boxShadow: isWinning ? '0 0 0 3px rgba(34,197,94,0.8)' : 'none',
                          marginRight: cIndex < row.length - 1 ? '12px' : '0px',
                        }} />
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>

            {/* Details */}
            <div style={{ display: 'flex', flexDirection: 'column', minWidth: '360px', marginLeft: '36px' }}>
              <div style={{ display: 'flex', fontSize: '36px', fontWeight: 800, textShadow: '0 3px 6px rgba(0,0,0,0.3)' }}>{winnerLabel} wins!</div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', background: '#ffffff', padding: '12px 16px', borderRadius: '12px', border: '1px solid #e5e7eb', marginTop: '12px' }}>
                  <div style={{ display: 'flex', opacity: 0.85 }}>Mode</div>
                  <div style={{ display: 'flex', fontWeight: 700 }}>{modeLabel}</div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', background: '#ffffff', padding: '12px 16px', borderRadius: '12px', border: '1px solid #e5e7eb', marginTop: '12px' }}>
                  <div style={{ display: 'flex', opacity: 0.85 }}>Difficulty</div>
                  <div style={{ display: 'flex', fontWeight: 700 }}>{difficultyLabel}</div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', background: '#ffffff', padding: '12px 16px', borderRadius: '12px', border: '1px solid #e5e7eb', marginTop: '12px' }}>
                  <div style={{ display: 'flex', opacity: 0.85 }}>Moves</div>
                  <div style={{ display: 'flex', fontWeight: 700 }}>{game.moves.length}</div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', background: '#ffffff', padding: '12px 16px', borderRadius: '12px', border: '1px solid #e5e7eb', marginTop: '12px' }}>
                  <div style={{ display: 'flex', opacity: 0.85 }}>Duration</div>
                  <div style={{ display: 'flex', fontWeight: 700 }}>{Math.round((game.duration ?? 0) / 1000)}s</div>
                </div>
              </div>
            </div>
          </div>

         
        </div>
      ),
      {
        width: 1200,
        height: 630,
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
        },
      }
    );
  } catch (e: unknown) {
    console.log(`${e instanceof Error ? e.message : 'Unknown error'}`);
    return new Response('Failed to generate the image', { status: 500 });
  }
}


