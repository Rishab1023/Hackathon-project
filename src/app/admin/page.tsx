import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getTranslations } from "@/lib/get-translation";
import { format } from "date-fns";
import type { Appointment } from "@/lib/types";
import { BarChart, BookOpen, CalendarCheck, Users, Activity } from "lucide-react";
import { getScheduledSessions, getResourceClickCount } from "@/lib/firestore";
import { unstable_noStore as noStore } from 'next/cache';
import AdminDashboard from "./_components/admin-dashboard";
import { AuthGuard } from "@/components/auth/auth-guard";

export default async function AdminDashboardPage({ params }: { params: { lang: string } }) {
  noStore(); // Ensure data is fetched on every request
  const t = await getTranslations();
  
  const [sessions, totalResources] = await Promise.all([
    getScheduledSessions(),
    getResourceClickCount()
  ]);
  
  const sortedSessions = sessions.sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  const recentSessions = sortedSessions.slice(0, 5);

  return (
    <AuthGuard adminOnly>
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

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-7">
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
                      {sortedSessions.map((session) => (
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
                                          {format(new Date(session.id), "PPp")}
                                      </p>
                                  </div>
                              </div>
                          ))
                      )}
                  </div>
              </CardContent>
          </Card>
        </div>
      </div>
    </AuthGuard>
  );
}
