"use client";

import { useState, useEffect } from "react";
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
import { BarChart, BookOpen, CalendarCheck, Users, Activity } from "lucide-react";
import { updateActiveUsers } from "@/app/actions/update-active-users";

export default function AdminDashboardPage() {
  const [sessions, setSessions] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { t, language } = useTranslation();
  const [activeUsers, setActiveUsers] = useState(1);
  const [totalResources, setTotalResources] = useState(0);

  useEffect(() => {
    // Fetch initial data
    try {
      const storedSessions = localStorage.getItem("scheduledSessions");
      if (storedSessions) {
        const parsedSessions = JSON.parse(storedSessions) as Appointment[];
        setSessions(parsedSessions.sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
      }
      // In a real app, this would be fetched from a database
      const resourceCount = JSON.parse(localStorage.getItem("resourceClickCount") || "0");
      setTotalResources(resourceCount);
    } catch (error) {
      console.error("Failed to load data from local storage", error);
    } finally {
      setIsLoading(false);
    }

    // Set up active user tracking
    const interval = setInterval(async () => {
      try {
        const data = await updateActiveUsers();
        setActiveUsers(data.count);
      } catch (error) {
        console.error("Failed to update active users:", error);
      }
    }, 5000); // Poll every 5 seconds

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        navigator.sendBeacon('/api/leave');
      }
    };
    window.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      clearInterval(interval);
      window.removeEventListener('visibilitychange', handleVisibilityChange);
      navigator.sendBeacon('/api/leave');
    };

  }, []);

  const recentSessions = sessions.slice(0, 5);
  const locales: { [key: string]: Locale } = { en: enUS, hi };

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <div className="space-y-2 mb-12">
        <h1 className="font-headline text-4xl font-bold tracking-tighter sm:text-5xl">
          {t('admin.title')}
        </h1>
        <p className="max-w-[700px] text-muted-foreground md:text-xl">
          {t('admin.description')}
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('admin.cards.totalSessions.title')}</CardTitle>
            <CalendarCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{sessions.length}</div>
            <p className="text-xs text-muted-foreground">{t('admin.cards.totalSessions.description')}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('admin.cards.resourcesAccessed.title')}</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalResources}</div>
            <p className="text-xs text-muted-foreground">{t('admin.cards.resourcesAccessed.description')}</p>
          </CardContent>
        </Card>
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
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('admin.cards.engagement.title')}</CardTitle>
            <BarChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{t('admin.cards.engagement.value')}</div>
            <p className="text-xs text-muted-foreground">{t('admin.cards.engagement.description')}</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-7">
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle>{t('admin.sessions.title')}</CardTitle>
            <CardDescription>{t('admin.sessions.description')}</CardDescription>
          </CardHeader>
          <CardContent>
              {isLoading ? (
                  <p>{t('admin.loading')}</p>
              ) : sessions.length === 0 ? (
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
        <Card className="lg:col-span-3">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Activity />
                    {t('admin.recentActivity.title')}
                </CardTitle>
                <CardDescription>{t('admin.recentActivity.description')}</CardDescription>
            </CardHeader>
            <CardContent>
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
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
