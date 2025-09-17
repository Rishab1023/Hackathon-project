import { NextResponse } from 'next/server';
import { leaveActiveUsers } from '@/app/actions/update-active-users';

// This endpoint is used for navigator.sendBeacon
export async function POST(request: Request) {
  try {
    // navigator.sendBeacon sends data as text/plain, so we parse it manually
    const body = await request.text();
    const { userId } = JSON.parse(body);
    
    if (userId) {
      await leaveActiveUsers(userId);
    }
    
    return new NextResponse('OK', { status: 200 });
  } catch (error) {
    console.error('Error in beacon leave API:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export const dynamic = 'force-dynamic';
