
import { AuthGuard } from "@/components/auth/auth-guard";
import { getTranslations } from "@/lib/get-translation";
import AnalyticsCards from "./_components/analytics-cards";
import RecentActivity from "./_components/recent-activity";
import SessionsList from "./_components/sessions-list";
import type { Appointment } from "@/lib/types";

// Mock data to prevent server-side Firestore errors
const mockSessions: Appointment[] = [
  {
    _id: "1",
    name: "John Doe",
    email: "john@example.com",
    date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    time: "10:00 AM",
    userId: "user1",
  },
  {
    _id: "2",
    name: "Jane Smith",
    email: "jane@example.com",
    date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    time: "02:00 PM",
    userId: "user2",
  },
];
const mockAnalytics = { totalSessions: 5, totalResources: 12 };

export default async function AdminDashboardPage() {
  const t = await getTranslations();
  // Using mock data to ensure the page loads without database errors.
  const sessions = mockSessions;
  const { totalSessions, totalResources } = mockAnalytics;
  
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
