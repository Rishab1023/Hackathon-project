import { getTranslations } from "@/lib/get-translation";
import { getMyScheduledSessions } from "@/lib/firestore";
import MySessionsClientPage from "./_components/my-sessions-client-page";
import { auth } from "@/lib/firebase";

export default async function MySessionsPage() {
  const t = await getTranslations();

  // This is a server component, but auth state is only available on the client.
  // We can get the current user on the server during the first render if needed,
  // but for a dynamic page like this, we'll let the client component handle auth.
  // For this example, we assume we can't fetch sessions without a user ID.
  // A real app might pass a user ID from a server session.

  return <MySessionsClientPage />;
}
