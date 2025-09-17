"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslation } from "@/hooks/use-translation";
import type { Appointment } from "@/lib/types";

const SESSIONS_STORAGE_KEY = "mindbloom-sessions";

export default function SessionsList() {
    const { t } = useTranslation();
    const [sessions, setSessions] = useState<Appointment[]>([]);

    useEffect(() => {
        const fetchSessions = () => {
            try {
                const allSessions = JSON.parse(localStorage.getItem(SESSIONS_STORAGE_KEY) || "[]") as Appointment[];
                const sortedSessions = allSessions.sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());
                setSessions(sortedSessions);
            } catch (error) {
                console.error("Failed to load sessions from local storage", error);
            }
        };

        fetchSessions();

        // Listen for changes in local storage to update the list
        const handleStorageChange = () => {
            fetchSessions();
        };
        window.addEventListener('storage', handleStorageChange);
        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, []);

    return (
        <Card className="lg:col-span-4">
            <CardHeader>
                <CardTitle>{t('admin.sessions.title')}</CardTitle>
                <CardDescription>{t('admin.sessions.description')}</CardDescription>
            </CardHeader>
            <CardContent>
                {sessions.length === 0 ? (
                    <div className="text-center py-8">
                        <p className="text-muted-foreground">{t('admin.noSessions')}</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {sessions.map((session) => (
                            <div key={session.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50">
                                <div className="flex items-center gap-4">
                                    <div className="font-medium">{session.name}</div>
                                </div>
                                <div className="text-right">
                                    <div className="font-medium">{format(new Date(session.date), "PPP")}</div>
                                    <div className="text-sm text-muted-foreground">{session.time}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
