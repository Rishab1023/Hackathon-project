import { kv } from "@vercel/kv";
import { revalidateTag } from "next/cache";
import { type NextRequest } from "next/server";

const ACTIVE_USERS_KEY = "activeUsers";

export async function POST(request: NextRequest) {
  const body = await request.text();
  const userId = body.trim();

  if (userId) {
    try {
      await kv.zrem(ACTIVE_USERS_KEY, userId);
      revalidateTag("active-users");
      return new Response("OK", { status: 200 });
    } catch (error) {
      console.error("Error removing user:", error);
      return new Response("Internal Server Error", { status: 500 });
    }
  }
  return new Response("Bad Request", { status: 400 });
}
