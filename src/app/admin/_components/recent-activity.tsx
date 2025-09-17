"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, CalendarCheck } from "lucide-react";
import { useTranslation } from "@/hooks/use-translation";
import type { Appointment } from "@/lib/types";

const SESSIONS_STORAGE_KEY = "mindbloom-sessions";

export default function RecentActivity() {
    const { t } = useTranslation();
    const [recentSessions, setRecentSessions] = useState<Appointment[]>([]);

    useEffect(() => {
        const fetchRecentSessions = () => {
            try {
                const allSessions = JSON.parse(localStorage.getItem(SESSIONS_STORAGE_KEY) || "[]") as Appointment[];
                const sortedSessions = allSessions.sort((a,b) => new Date(b.id.split('_')[1]).getTime() - new Date(a.id.split('_')[1]).getTime());
                setRecentSessions(sortedSessions.slice(0, 5));
            } catch (error) {
                console.error("Failed to load recent sessions from local storage", error);
            }
        };

        fetchRecentSessions();

        const handleStorageChange = () => {
            fetchRecentSessions();
        };
        window.addEventListener('storage', handleStorageChange);
        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, []);

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
                            <div key={session.id} className="flex items-start gap-4">
                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                                    <CalendarCheck className="h-5 w-5 text-primary" />
                                </div>
                                <div className="space-y-1">
                                    <p className="text-sm font-medium">
                                        {t('admin.recentActivity.scheduled', { name: session.name })}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        {format(new Date(parseInt(session.id.split('_')[1])), "PPp")}
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
