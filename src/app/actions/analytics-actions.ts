"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/firebase";
import { collection, doc, getDoc, setDoc, increment, getDocs } from "firebase/firestore";
import type { Appointment } from "@/lib/types";

export async function trackResourceClick(resourceId: string) {
    const resourceRef = doc(db, "analytics", "resources");
    try {
        await setDoc(resourceRef, {
            totalClicks: increment(1),
            [`clicks.${resourceId}`]: increment(1),
        }, { merge: true });
        revalidatePath("/admin");
    } catch (error) {
        console.error("Error tracking resource click:", error);
    }
}

export async function getAnalyticsData() {
    try {
        // Fetch total sessions
        const sessionsSnapshot = await getDocs(collection(db, "appointments"));
        const totalSessions = sessionsSnapshot.size;

        // Fetch resource analytics
        const resourceAnalyticsDoc = await getDoc(doc(db, "analytics", "resources"));
        const resourceData = resourceAnalyticsDoc.data();
        const totalResources = resourceData?.totalClicks || 0;

        return {
            totalSessions,
            totalResources,
            // You can add more complex analytics here if needed
        };
    } catch (error) {
        console.error("Failed to load analytics data from Firestore:", error);
        return {
            totalSessions: 0,
            totalResources: 0,
        };
    }
}
