import {
  ref,
  get,
  child,
  runTransaction,
  DatabaseError
} from "firebase/database";
import { db } from "./firebase";
import type { Appointment } from "./types";

const SESSIONS_PATH = "sessions";
const ANALYTICS_PATH = "analytics";

// ========== Appointment/Session Functions (SERVER-SIDE) ==========

// Get all scheduled sessions (for admin)
export async function getScheduledSessions(): Promise<Appointment[]> {
  try {
    const sessionsRef = ref(db, SESSIONS_PATH);
    const snapshot = await get(sessionsRef);
    if (snapshot.exists()) {
      const sessionsData = snapshot.val();
      return Object.keys(sessionsData).map(key => ({
        id: key,
        ...sessionsData[key]
      }));
    }
    return [];
  } catch (error) {
    if (error instanceof DatabaseError) {
      console.error("Firebase Realtime Database permission denied. Please ensure your security rules allow read access to the '/sessions' path.");
      return []; // Return empty array to prevent app crash
    }
    console.error("Failed to get scheduled sessions:", error);
    throw error; // Re-throw other errors
  }
}


// ========== Analytics Functions (SERVER-SIDE) ==========

const resourceAnalyticsRef = ref(db, `${ANALYTICS_PATH}/resources`);

// Get the total resource click count
export async function getResourceClickCount(): Promise<number> {
  try {
    const snapshot = await get(child(resourceAnalyticsRef, 'totalClicks'));
    if (snapshot.exists()) {
      return snapshot.val();
    }
    return 0;
  } catch (error) {
     if (error instanceof DatabaseError) {
      console.error("Firebase Realtime Database permission denied. Please ensure your security rules allow read access to '/analytics/resources'.");
      return 0; // Return 0 to prevent app crash
    }
    console.error("Failed to get resource click count:", error);
    throw error; // Re-throw other errors
  }
}
