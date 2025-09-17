import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  where,
  getDoc,
  setDoc,
  runTransaction,
  FirestoreError,
} from "firebase/firestore";
import { db } from "./firebase";
import type { Appointment } from "./types";

const SESSIONS_COLLECTION = "sessions";
const ANALYTICS_COLLECTION = "analytics";

// ========== Appointment/Session Functions ==========

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

// Get sessions for a specific user
export async function getMyScheduledSessions(userId: string): Promise<Appointment[]> {
  const q = query(collection(db, SESSIONS_COLLECTION), where("userId", "==", userId));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Appointment));
}

// Add a new scheduled session
export async function addScheduledSession(session: Omit<Appointment, 'id'>): Promise<string> {
  const docRef = await addDoc(collection(db, SESSIONS_COLLECTION), session);
  return docRef.id;
}

// Delete a scheduled session
export async function deleteScheduledSession(sessionId: string): Promise<void> {
  await deleteDoc(doc(db, SESSIONS_COLLECTION, sessionId));
}


// ========== Analytics Functions ==========

const resourceAnalyticsDocRef = doc(db, ANALYTICS_COLLECTION, "resources");

// Increment the click count for a specific resource
export async function incrementResourceClickCount(resourceId: string): Promise<void> {
  try {
    await runTransaction(db, async (transaction) => {
      const docSnap = await transaction.get(resourceAnalyticsDocRef);
      if (!docSnap.exists()) {
        transaction.set(resourceAnalyticsDocRef, { totalClicks: 1, [resourceId]: 1 });
      } else {
        const data = docSnap.data();
        const newTotal = (data.totalClicks || 0) + 1;
        const newResourceCount = (data[resourceId] || 0) + 1;
        transaction.update(resourceAnalyticsDocRef, {
          totalClicks: newTotal,
          [resourceId]: newResourceCount,
        });
      }
    });
  } catch (e) {
    console.error("Transaction failed: ", e);
  }
}

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
