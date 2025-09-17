"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, CalendarCheck } from "lucide-react";
import { useTranslation } from "@/hooks/use-translation";
import type { Appointment } from "@/lib/types";

const SESSIONS_STORAGE_KEY = "sessions";

export default function RecentActivity() {
    const { t } = useTranslation();
    const [recentSessions, setRecentSessions] = useState<Appointment[]>([]);

    useEffect(() => {
        const fetchRecentSessions = () => {
            try {
                const allSessions = JSON.parse(localStorage.getItem(SESSIONS_STORAGE_KEY) || "[]") as Appointment[];
                // Sort by date created (assuming id is a timestamp-based string)
                const sortedSessions = allSessions.sort((a,b) => {
                  const dateA = a._id ? new Date(parseInt(a._id.split('_')[1])).getTime() : 0;
                  const dateB = b._id ? new Date(parseInt(b._id.split('_')[1])).getTime() : 0;
                  return dateB - dateA;
                });
                setRecentSessions(sortedSessions.slice(0, 5)); // Get latest 5
            } catch (e) {
                console.error("Failed to load recent sessions from localStorage", e);
            }
        };
        
        fetchRecentSessions();
        
        // Listen for storage changes to update the list
        const handleStorageChange = (event: StorageEvent) => {
            if (event.key === SESSIONS_STORAGE_KEY) {
                fetchRecentSessions();
            }
        };

        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);

    }, []);

    const getSessionDate = (session: Appointment) => {
        if (session._id) {
            try {
                return new Date(parseInt(session._id.split('_')[1]));
            } catch (e) {
                // Fallback for different formats
            }
        }
        if (session.date && !isNaN(new Date(session.date).getTime())) {
            return new Date(session.date);
        }
        return new Date();
    }

    return (
        <Card className="lg:col-span-3">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Activity />
                    {t('admin.recentActivity.title')}
                </CardTitle>
                <CardDescription>{t('admin.recentActivity.description')}</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-6">
                    {recentSessions.length === 0 ? (
                        <p className="text-sm text-muted-foreground">{t('admin.recentActivity.noActivity')}</p>
                    ) : (
                        recentSessions.map(session => (
                            <div key={session._id} className="flex items-start gap-4">
                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                                    <CalendarCheck className="h-5 w-5 text-primary" />
                                </div>
                                <div className="space-y-1">
                                    <p className="text-sm font-medium">
                                        {t('admin.recentActivity.scheduled', { name: session.name })}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        {format(getSessionDate(session), "PPp")}
                                    </p>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
