
import { AuthGuard } from "@/components/auth/auth-guard";
import { getTranslations } from "@/lib/get-translation";
import AnalyticsCards from "./_components/analytics-cards";
import RecentActivity from "./_components/recent-activity";
import SessionsList from "./_components/sessions-list";
import { Appointment } from "@/lib/types";

async function getAnalyticsData() {
  // Mock data to avoid database connection
  const totalSessions = 0;
  const totalResources = 0;
  const recentSessions: Appointment[] = [];
  const allSessions: Appointment[] = [];

  return { totalSessions, totalResources, recentSessions, allSessions };
}


export default async function AdminDashboardPage() {
  const t = await getTranslations();
  const { totalSessions, totalResources, recentSessions, allSessions } = await getAnalyticsData();
  
  // Convert ObjectId to string for client-side consumption
  const sanitizedRecentSessions = recentSessions.map(s => ({...s, _id: s._id?.toString()}));
  const sanitizedAllSessions = allSessions.map(s => ({...s, _id: s._id?.toString()}));


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
          <SessionsList sessions={sanitizedAllSessions} />
          <RecentActivity recentSessions={sanitizedRecentSessions} />
        </div>
      </div>
    </AuthGuard>
  );
}
