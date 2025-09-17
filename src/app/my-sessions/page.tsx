import { AuthGuard } from "@/components/auth/auth-guard";
import MySessionsClientPage from "./_components/my-sessions-client-page";

export default async function MySessionsPage() {
  // The AuthGuard will handle redirecting unauthenticated users.
  // MySessionsClientPage handles fetching data for the logged-in user.
  return (
    <AuthGuard>
      <MySessionsClientPage />
    </AuthGuard>
  );
}
