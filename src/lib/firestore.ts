import {
  collection,
  getDocs,
  query,
  doc,
  getDoc,
  runTransaction,
  FirestoreError,
} from "firebase/firestore";
import { db } from "./firebase";
import type { Appointment } from "./types";

const SESSIONS_COLLECTION = "sessions";
const ANALYTICS_COLLECTION = "analytics";

// ========== Appointment/Session Functions (SERVER-SIDE) ==========

// Get all scheduled sessions (for admin)
export async function getScheduledSessions(): Promise<Appointment[]> {
  try {
    const q = query(collection(db, SESSIONS_COLLECTION));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Appointment));
  } catch (error) {
    if (error instanceof FirestoreError && error.code === 'permission-denied') {
      console.error("Firestore permission denied. Please ensure the Firestore API is enabled in your Google Cloud project and that your security rules allow access.");
      return []; // Return empty array to prevent app crash
    }
    console.error("Failed to get scheduled sessions:", error);
    throw error; // Re-throw other errors
  }
}


// ========== Analytics Functions (SERVER-SIDE) ==========

const resourceAnalyticsDocRef = doc(db, ANALYTICS_COLLECTION, "resources");

// Get the total resource click count
export async function getResourceClickCount(): Promise<number> {
  try {
    const docSnap = await getDoc(resourceAnalyticsDocRef);
    if (docSnap.exists()) {
      return docSnap.data().totalClicks || 0;
    }
    return 0;
  } catch (error) {
     if (error instanceof FirestoreError && error.code === 'permission-denied') {
      console.error("Firestore permission denied. Please ensure the Firestore API is enabled in your Google Cloud project and that your security rules allow access.");
      return 0; // Return 0 to prevent app crash
    }
    console.error("Failed to get resource click count:", error);
    throw error; // Re-throw other errors
  }
}

// NOTE: Client-side functions like add, delete, and update have been moved
// directly into their respective client components to ensure they use the
// correct client-side Firebase instance.
