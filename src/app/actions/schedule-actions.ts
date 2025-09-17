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
}


export async function getMyScheduledSessions(userId: string): Promise<Appointment[]> {
    const q = query(collection(db, "appointments"), where("userId", "==", userId));
    const querySnapshot = await getDocs(q);
    const sessions = querySnapshot.docs.map(doc => ({
        _id: doc.id,
        ...(doc.data() as Omit<Appointment, "_id">),
    }));
    return sessions.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
}

export async function getAllScheduledSessions(): Promise<Appointment[]> {
    const querySnapshot = await getDocs(collection(db, "appointments"));
    const sessions = querySnapshot.docs.map(doc => ({
        _id: doc.id,
        ...(doc.data() as Omit<Appointment, "_id">),
    }));
    return sessions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export async function deleteScheduledSession(sessionId: string): Promise<void> {
    await deleteDoc(doc(db, "appointments", sessionId));
    revalidatePath("/my-sessions");
    revalidatePath("/admin");
}
