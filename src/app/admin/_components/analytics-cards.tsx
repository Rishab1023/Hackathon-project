"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, BookOpen, CalendarCheck } from "lucide-react";
import AdminDashboard from "./admin-dashboard";
import { useTranslation } from "@/hooks/use-translation";
import type { Appointment } from "@/lib/types";

const SESSIONS_STORAGE_KEY = "sessions";
const ANALYTICS_STORAGE_KEY = "resourceAnalytics";

export default function AnalyticsCards() {
    const { t } = useTranslation();
    const [totalSessions, setTotalSessions] = useState(0);
    const [totalResources, setTotalResources] = useState(0);

    useEffect(() => {
        try {
            // Fetch total sessions
            const sessionsData = localStorage.getItem(SESSIONS_STORAGE_KEY);
            const sessions: Appointment[] = sessionsData ? JSON.parse(sessionsData) : [];
            setTotalSessions(sessions.length);

            // Fetch total resource clicks
            const analyticsData = localStorage.getItem(ANALYTICS_STORAGE_KEY);
            if (analyticsData) {
                const analytics = JSON.parse(analyticsData);
                setTotalResources(analytics.totalClicks || 0);
            }
        } catch (error) {
            console.error("Failed to load analytics data from localStorage:", error);
        }
    }, []);

    return (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('admin.cards.totalSessions.title')}</CardTitle>
              <CalendarCheck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalSessions}</div>
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
          
          <AdminDashboard />

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
    );
}
