import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';

export async function GET(request: NextRequest) {
  try {
    // Test database connection
    const connectionState = mongoose.connection.readyState;
    
    const states = {
      0: 'disconnected',
      1: 'connected',
      2: 'connecting',
      3: 'disconnecting',
    };

    return NextResponse.json({
      status: 'success',
      connectionState: states[connectionState as keyof typeof states] || 'unknown',
      readyState: connectionState,
      message: connectionState === 1 ? 'Database connected successfully' : 'Database not connected'
    });
  } catch (error) {
    console.error('Database test error:', error);
    return NextResponse.json(
      { 
        status: 'error',
        message: 'Database connection test failed',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

