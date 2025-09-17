"use server";

import { getDb } from "@/lib/mongodb";
import { revalidatePath } from "next/cache";

const ANALYTICS_COLLECTION = "analytics";

async function getAnalyticsCollection() {
    const db = await getDb();
    return db.collection(ANALYTICS_COLlection);
}

export async function incrementResourceClickCount(resourceId: string): Promise<void> {
    try {
        const analyticsCollection = await getAnalyticsCollection();
        
        await analyticsCollection.updateOne(
            { name: "resourceAnalytics" },
            { 
                $inc: { 
                    totalClicks: 1,
                    [`clicks.${resourceId}`]: 1 
                } 
            },
            { upsert: true }
        );
        revalidatePath("/admin");
    } catch (e) {
      console.error("Failed to update resource analytics in MongoDB: ", e);
      // We don't throw here to avoid breaking the client-side flow
    }
}
