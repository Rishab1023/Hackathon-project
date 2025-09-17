"use server";

import { kv } from "@vercel/kv";
import { revalidateTag } from "next/cache";

const ACTIVE_USERS_KEY = "activeUsers";
const USER_EXPIRATION_SECONDS = 10; // User is considered inactive after 10 seconds

export async function updateActiveUsers(userId: string) {
  const now = Date.now();
  
  const pipeline = kv.pipeline();
  // Add or update the current user's timestamp
  pipeline.zadd(ACTIVE_USERS_KEY, { score: now, member: userId });
  // Remove users who haven't been seen in the last expiration period
  pipeline.zremrangebyscore(ACTIVE_USERS_KEY, 0, now - USER_EXPIRATION_SECONDS * 1000);
  // Get the total count of active users
  pipeline.zcard(ACTIVE_USERS_KEY);
  
  const [, , count] = await pipeline.exec<[number, number, number]>();

  revalidateTag("active-users");

  return { count };
}

export async function leaveActiveUsers(userId: string) {
  await kv.zrem(ACTIVE_USERS_KEY, userId);
  revalidateTag("active-users");
}
