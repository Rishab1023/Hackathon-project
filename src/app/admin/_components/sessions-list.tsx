"use client";

import { format } from "date-fns";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslation } from "@/hooks/use-translation";
import type { Appointment } from "@/lib/types";

interface SessionsListProps {
    sessions: Appointment[];
}

export default function SessionsList({ sessions }: SessionsListProps) {
    const { t } = useTranslation();

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
                            <div key={session._id} className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50">
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
