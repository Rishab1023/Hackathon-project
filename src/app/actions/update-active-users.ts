"use server";

import { revalidatePath } from "next/cache";
import { getDb } from "@/lib/mongodb";

const ACTIVE_USERS_COLLECTION = "activeUsers";

interface ActiveUser {
  userId: string;
  lastActive: Date;
}

// Set a timeout for 5 minutes
const ACTIVE_TIMEOUT_MS = 5 * 60 * 1000;

async function getActiveUsersCollection() {
  const db = await getDb();
  return db.collection<ActiveUser>(ACTIVE_USERS_COLLECTION);
}

// This function should be called periodically by clients.
export async function updateActiveUsers(userId: string) {
  const collection = await getActiveUsersCollection();

  // Remove users who have timed out
  const timeout = new Date(Date.now() - ACTIVE_TIMEOUT_MS);
  await collection.deleteMany({ lastActive: { $lt: timeout } });
  
  // Add or update the current user
  await collection.updateOne(
    { userId },
    { $set: { userId, lastActive: new Date() } },
    { upsert: true }
  );

  const count = await collection.countDocuments();
  
  revalidatePath("/admin");
  
  return { count };
}

// This should be called when the user leaves the page.
export async function leaveActiveUsers(userId:string) {
   const collection = await getActiveUsersCollection();
   await collection.deleteOne({ userId });
   revalidatePath("/admin");
}
