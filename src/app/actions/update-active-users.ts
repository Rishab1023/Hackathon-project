"use server";

import { revalidatePath } from "next/cache";

// This is a mock function and does not use a database.
// A real implementation would use a presence solution like Firebase Realtime Database.
export async function updateActiveUsers(userId: string) {
  revalidatePath("/admin");
  return { count: 1 };
}

export async function leaveActiveUsers(userId:string) {
   revalidatePath("/admin");
}
