"use client";

import { format } from "date-fns";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, CalendarCheck } from "lucide-react";
import { useTranslation } from "@/hooks/use-translation";
import type { Appointment } from "@/lib/types";

interface RecentActivityProps {
    sessions: Appointment[];
}

export default function RecentActivity({ sessions }: RecentActivityProps) {
    const { t } = useTranslation();
    const recentSessions = sessions.slice(0, 5);

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
                                        {format(new Date(session.date), "PPp")}
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
