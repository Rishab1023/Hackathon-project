"use client";

import { useState, useEffect, useRef } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useTranslation } from "@/hooks/use-translation";
import { format, formatDistanceToNow } from "date-fns";
import { enUS, hi } from "date-fns/locale";
import type { Appointment } from "@/lib/types";
import { Users, Activity, CalendarCheck } from "lucide-react";
import { updateActiveUsers, leaveActiveUsers } from "@/app/actions/update-active-users";

export default function AdminDashboard({ recentSessions }: { recentSessions?: Appointment[]}) {
  const { t, language } = useTranslation();
  const [activeUsers, setActiveUsers] = useState(1);
  const userIdRef = useRef<string | null>(null);

  useEffect(() => {
    userIdRef.current = "user_" + Math.random().toString(36).substr(2, 9);
    const userId = userIdRef.current;

    const updateUser = async () => {
       try {
          const data = await updateActiveUsers(userId);
          setActiveUsers(data.count);
        } catch (error) {
          console.error("Failed to update active users:", error);
        }
    }

    updateUser();
    const interval = setInterval(updateUser, 5000);

    const handleBeforeUnload = () => {
      if (userId) {
        // Use sendBeacon as it's more reliable for leaving pages
        navigator.sendBeacon('/api/leave', JSON.stringify({ userId }));
      }
    };
    
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      clearInterval(interval);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      if (userId) {
        leaveActiveUsers(userId);
      }
    };
  }, []);

  const locales: { [key: string]: Locale } = { en: enUS, hi };

  if (recentSessions) {
    return (
      <>
        {recentSessions.length === 0 ? (
            <p className="text-sm text-muted-foreground">{t('admin.recentActivity.noActivity')}</p>
        ) : (
            <div className="space-y-6">
                {recentSessions.map(session => (
                    <div key={session.id} className="flex items-start gap-4">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                          <CalendarCheck className="h-5 w-5 text-primary" />
                        </div>
                        <div className="space-y-1">
                            <p className="text-sm font-medium">
                                {t('admin.recentActivity.scheduled', {name: session.name})}
                            </p>
                            <p className="text-xs text-muted-foreground">
                                {formatDistanceToNow(new Date(session.id), { addSuffix: true, locale: locales[language] })}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        )}
      </>
    )
  }

  return (
      <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('admin.cards.activeAdmins.title')}</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeUsers}</div>
            <p className="text-xs text-muted-foreground">{t('admin.cards.activeAdmins.description')}</p>
          </CardContent>
        </Card>
  )
}
