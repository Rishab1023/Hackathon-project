"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/firebase";
import { collection, addDoc, getDocs, query, where, deleteDoc, doc } from "firebase/firestore";
import type { Appointment } from "@/lib/types";
import { format, startOfDay, endOfDay } from "date-fns";

export async function addScheduledSession(appointment: Omit<Appointment, "_id">): Promise<Appointment> {
  const docRef = await addDoc(collection(db, "appointments"), appointment);
  
  revalidatePath("/my-sessions");
  revalidatePath("/admin");

  return { _id: docRef.id, ...appointment };
}

export async function getScheduledTimesForDate(date: Date): Promise<string[]> {
    try {
        const start = startOfDay(date);
        const end = endOfDay(date);

        const q = query(
            collection(db, "appointments"),
            where("date", ">=", start.toISOString()),
            where("date", "<=", end.toISOString())
        );

        const querySnapshot = await getDocs(q);
        const times = querySnapshot.docs.map(doc => doc.data().time as string);
        return times;
    } catch (error) {
        console.error("Failed to fetch scheduled times from Firestore:", error);
        return [];
    }
}


export async function getMyScheduledSessions(userId: string): Promise<Appointment[]> {
    try {
        const q = query(collection(db, "appointments"), where("userId", "==", userId));
        const querySnapshot = await getDocs(q);
        const sessions = querySnapshot.docs.map(doc => ({
            _id: doc.id,
            ...(doc.data() as Omit<Appointment, "_id">),
        }));
        return sessions.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    } catch (error) {
        console.error("Failed to load user sessions from Firestore:", error);
        return [];
    }
}

export async function getAllScheduledSessions(): Promise<Appointment[]> {
    try {
        const querySnapshot = await getDocs(collection(db, "appointments"));
        const sessions = querySnapshot.docs.map(doc => ({
            _id: doc.id,
            ...(doc.data() as Omit<Appointment, "_id">),
        }));
        return sessions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    } catch (error) {
        console.error("Failed to load all sessions from Firestore:", error);
        return [];
    }
}

export async function deleteScheduledSession(sessionId: string): Promise<void> {
    try {
        await deleteDoc(doc(db, "appointments", sessionId));
        revalidatePath("/my-sessions");
        revalidatePath("/admin");
    } catch(error) {
        console.error("Failed to delete session from Firestore", error);
    }
}
