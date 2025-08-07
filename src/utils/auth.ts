import { createClient, Errors } from '@farcaster/quick-auth';
import { NextRequest } from 'next/server';

const client = createClient();

export interface AuthenticatedUser {
  fid: number;
  primaryAddress?: string;
}

export async function validateQuickAuthToken(request: NextRequest): Promise<AuthenticatedUser | null> {
  const authorization = request.headers.get('Authorization');
  
  if (!authorization || !authorization.startsWith('Bearer ')) {
    return null;
  }

  try {
    const token = authorization.split(' ')[1];
    console.log('token', token);
    console.log('domain', process.env.HOSTNAME || 'localhost:3000');
    const payload = await client.verifyJwt({
      token,
      domain: process.env.HOSTNAME || 'localhost:3000',
    });

    console.log('payload', payload);
    return {
      fid: payload.sub,
      primaryAddress: await getPrimaryAddress(payload.sub),
    };
  } catch (error) {
    if (error instanceof Errors.InvalidTokenError) {
      console.info('Invalid token:', error.message);
      return null;
    }
    throw error;
  }
}

async function getPrimaryAddress(fid: number): Promise<string | undefined> {
  try {
    const response = await fetch(
      `https://api.farcaster.xyz/fc/primary-address?fid=${fid}&protocol=ethereum`
    );
    
    if (response.ok) {
      const { result } = await response.json<{
        result: {
          address: {
            fid: number;
            protocol: 'ethereum' | 'solana';
            address: string;
          };
        };
      }>();
      return result.address.address;
    }
  } catch (error) {
    console.error('Error fetching primary address:', error);
  }
  
  return undefined;
}

