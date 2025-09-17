
import { AuthGuard } from "@/components/auth/auth-guard";
import { getTranslations } from "@/lib/get-translation";
import AnalyticsCards from "./_components/analytics-cards";
import RecentActivity from "./_components/recent-activity";
import SessionsList from "./_components/sessions-list";
import { getAllScheduledSessions } from "@/app/actions/schedule-actions";
import { getAnalyticsData } from "@/app/actions/analytics-actions";

export default async function AdminDashboardPage() {
  const t = await getTranslations();
  const sessions = await getAllScheduledSessions();
  const { totalSessions, totalResources } = await getAnalyticsData();
  
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

        <AnalyticsCards totalSessions={totalSessions} totalResources={totalResources} />
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-7 mt-8">
          <SessionsList sessions={sessions} />
          <RecentActivity sessions={sessions} />
        </div>
      </div>
    </AuthGuard>
  );
}
