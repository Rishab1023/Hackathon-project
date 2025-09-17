"use client";

import { format } from "date-fns";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, CalendarCheck } from "lucide-react";
import { useTranslation } from "@/hooks/use-translation";
import type { Appointment } from "@/lib/types";

interface RecentActivityProps {
    recentSessions: Appointment[];
}

export default function RecentActivity({ recentSessions }: RecentActivityProps) {
    const { t } = useTranslation();

    const getSessionDate = (session: Appointment) => {
        if (session._id) {
            // Attempt to parse date from MongoDB ObjectId if it exists
            try {
                return new Date(parseInt(session._id.substring(0, 8), 16) * 1000);
            } catch (e) {
                // Fallback for invalid ObjectId or other formats
            }
        }
        // Fallback to the session's date property if available and valid
        if (session.date && !isNaN(new Date(session.date).getTime())) {
            return new Date(session.date);
        }
        // Return current date as a last resort
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
