"use server";

// This is a mock implementation since Vercel KV is removed.
// In a real app, this would be handled differently without a serverless function dependency.

export async function updateActiveUsers(userId: string) {
  // Mock: does nothing, returns a static count.
  return { count: 1 };
}

export async function leaveActiveUsers(userId: string) {
  // Mock: does nothing.
  return;
}
