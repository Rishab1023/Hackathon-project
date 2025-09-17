import { NextResponse } from 'next/server';

// This is a mock implementation as we are not using a persistent store anymore.
export async function POST(request: Request) {
  try {
    // In a local-storage-only app, the server doesn't have a central list of active users.
    // This endpoint can effectively do nothing.
    return new NextResponse('OK', { status: 200 });
  } catch (error) {
    console.error('Error in mock leave API:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

// This is required for sendBeacon to work.
export const dynamic = 'force-dynamic';
