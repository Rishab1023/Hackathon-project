"use server";

import { revalidatePath } from "next/cache";

// This is now a mock function and does not use a database.
export async function updateActiveUsers(userId: string) {
  // In a real scenario, this would interact with a database or cache.
  // For now, we'll just return a static count to avoid DB errors.
  
  // Revalidate to show Next.js it's a server action
  revalidatePath("/admin");
  
  return { count: 1 };
}

// This is now a mock function and does not use a database.
export async function leaveActiveUsers(userId:string) {
   // In a real scenario, this would interact with a database or cache.
   revalidatePath("/admin");
}
