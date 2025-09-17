"use server";

import { kv } from "@vercel/kv";
import { revalidateTag } from "next/cache";

const ACTIVE_USERS_KEY = "activeUsers";
const USER_EXPIRATION_SECONDS = 60; // 1 minute

export async function updateActiveUsers() {
  const userId = "user_" + Math.random().toString(36).substr(2, 9);
  const now = Date.now();
  
  const pipeline = kv.pipeline();
  pipeline.zadd(ACTIVE_USERS_KEY, { score: now, member: userId });
  pipeline.zremrangebyscore(ACTIVE_USERS_KEY, 0, now - USER_EXPIRATION_SECONDS * 1000);
  pipeline.zcard(ACTIVE_USERS_KEY);
  
  const [, , count] = await pipeline.exec<[number, number, number]>();

  revalidateTag("active-users");

  return { count };
}

export async function leaveActiveUsers(userId: string) {
    await kv.zrem(ACTIVE_USERS_KEY, userId);
    revalidateTag("active-users");
}
