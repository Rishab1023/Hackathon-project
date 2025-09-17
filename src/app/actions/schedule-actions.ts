"use server";

import { getDb } from "@/lib/mongodb";
import type { Appointment } from "@/lib/types";
import { revalidatePath } from "next/cache";
import { ObjectId } from "mongodb";

const SESSIONS_COLLECTION = "sessions";

async function getSessionsCollection() {
    const db = await getDb();
    return db.collection<Omit<Appointment, '_id'>>(SESSIONS_COLLECTION);
}

export async function addScheduledSession(sessionData: Omit<Appointment, '_id'>) {
    const sessions = await getSessionsCollection();
    
    // Check for existing appointment at the same date and time to prevent double booking
    const existingAppointment = await sessions.findOne({
      date: sessionData.date,
      time: sessionData.time,
    });

    if (existingAppointment) {
        return { success: false, error: "This time slot is no longer available." };
    }

    try {
        const result = await sessions.insertOne(sessionData);
        revalidatePath("/schedule");
        revalidatePath("/my-sessions");
        revalidatePath("/admin");
        return { success: true, insertedId: result.insertedId.toString() };
    } catch (error) {
        console.error("Error adding scheduled session:", error);
        return { success: false, error: "A server error occurred. Please try again." };
    }
}

export async function getScheduledTimesForDate(date: Date) {
    const sessions = await getSessionsCollection();
    const dateString = date.toISOString().split('T')[0];

    try {
        const appointments = await sessions.find({
            date: { $regex: `^${dateString}` }
        }).toArray();

        return appointments.map(appt => appt.time);
    } catch (e) {
        console.error("Failed to fetch scheduled times from MongoDB: ", e);
        return [];
    }
}

export async function getMyScheduledSessions(userId: string): Promise<Appointment[]> {
    const sessionsCollection = await getDb().then(db => db.collection(SESSIONS_COLLECTION));
    try {
        const userSessions = await sessionsCollection.find({ userId: userId }).toArray();
        
        return userSessions.map(session => ({
            ...session,
            _id: session._id.toString(),
        })) as Appointment[];
    } catch (e) {
        console.error("Failed to fetch user sessions from MongoDB: ", e);
        return [];
    }
}

export async function deleteScheduledSession(sessionId: string): Promise<{success: boolean}> {
    const sessionsCollection = await getSessionsCollection();
    if (!ObjectId.isValid(sessionId)) {
        console.error("Invalid session ID for deletion");
        return { success: false };
    }

    try {
        const result = await sessionsCollection.deleteOne({ _id: new ObjectId(sessionId) });

        if (result.deletedCount === 1) {
            revalidatePath("/my-sessions");
            revalidatePath("/admin");
            return { success: true };
        } else {
            return { success: false };
        }
    } catch (e) {
        console.error("Failed to delete session from MongoDB: ", e);
        return { success: false };
    }
}
