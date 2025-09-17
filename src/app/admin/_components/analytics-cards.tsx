"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, BookOpen, CalendarCheck, Users } from "lucide-react";
import AdminDashboard from "./admin-dashboard";
import { useTranslation } from "@/hooks/use-translation";
import type { Appointment } from "@/lib/types";

const SESSIONS_STORAGE_KEY = "mindbloom-sessions";
const RESOURCE_ANALYTICS_KEY = "mindbloom-resource-analytics";

export default function AnalyticsCards() {
    const { t } = useTranslation();
    const [totalSessions, setTotalSessions] = useState(0);
    const [totalResources, setTotalResources] = useState(0);

    useEffect(() => {
        // Fetch data from local storage on component mount
        try {
            const sessions = JSON.parse(localStorage.getItem(SESSIONS_STORAGE_KEY) || "[]") as Appointment[];
            setTotalSessions(sessions.length);

            const resourceAnalytics = JSON.parse(localStorage.getItem(RESOURCE_ANALYTICS_KEY) || "{}");
            setTotalResources(resourceAnalytics.totalClicks || 0);

        } catch (error) {
            console.error("Failed to load analytics data from local storage", error);
        }

        // Optional: Listen to storage events to update cards if data changes in another tab
        const handleStorageChange = () => {
             const sessions = JSON.parse(localStorage.getItem(SESSIONS_STORAGE_KEY) || "[]") as Appointment[];
            setTotalSessions(sessions.length);

            const resourceAnalytics = JSON.parse(localStorage.getItem(RESOURCE_ANALYTICS_KEY) || "{}");
            setTotalResources(resourceAnalytics.totalClicks || 0);
        };
        window.addEventListener('storage', handleStorageChange);
        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };

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
