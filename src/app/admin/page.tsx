
import { AuthGuard } from "@/components/auth/auth-guard";
import { getTranslations } from "@/lib/get-translation";
import AnalyticsCards from "./_components/analytics-cards";
import RecentActivity from "./_components/recent-activity";
import SessionsList from "./_components/sessions-list";
import type { Appointment } from "@/lib/types";

export default async function AdminDashboardPage() {
  const t = await getTranslations();
  
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

        {/* The components themselves will fetch data from localStorage on the client */}
        <AnalyticsCards />
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-7 mt-8">
          <SessionsList />
          <RecentActivity />
        </div>
      </div>
    </AuthGuard>
  );
}
