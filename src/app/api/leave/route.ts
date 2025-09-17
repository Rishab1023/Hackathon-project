import { NextResponse } from 'next/server';
import { leaveActiveUsers } from '@/app/actions/update-active-users';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId } = body;
    
    if (userId) {
      await leaveActiveUsers(userId);
    }
    
    return new NextResponse('OK', { status: 200 });

  } catch (error) {
    console.error('Error in leave API:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

// This is required for sendBeacon to work.
export const dynamic = 'force-dynamic';
