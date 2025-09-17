"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, BookOpen, CalendarCheck } from "lucide-react";
import AdminDashboard from "./admin-dashboard";
import { useTranslation } from "@/hooks/use-translation";

interface AnalyticsCardsProps {
    totalSessions: number;
    totalResources: number;
}

export default function AnalyticsCards({ totalSessions, totalResources }: AnalyticsCardsProps) {
    const { t } = useTranslation();

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
