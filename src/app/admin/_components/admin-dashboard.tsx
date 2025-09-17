"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslation } from "@/hooks/use-translation";
import { Users } from "lucide-react";
import { updateActiveUsers, leaveActiveUsers } from "@/app/actions/update-active-users";
import { useAuth } from "@/contexts/AuthContext";

export default function AdminDashboard() {
  const { t } = useTranslation();
  const [activeUsers, setActiveUsers] = useState(0);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;
    const userId = user.uid;

    const updateAndFetch = async () => {
      try {
        const { count } = await updateActiveUsers(userId);
        setActiveUsers(count);
      } catch (error) {
        console.error("Failed to update active users:", error);
      }
    };
    
    // Initial update
    updateAndFetch();

    // Update every 30 seconds
    const interval = setInterval(updateAndFetch, 30000);

    const handleBeforeUnload = () => {
       navigator.sendBeacon('/api/leave', JSON.stringify({ userId }));
    };
    
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      clearInterval(interval);
      window.removeEventListener("beforeunload", handleBeforeUnload);
      // This might not run on page close, hence the beacon
      leaveActiveUsers(userId); 
    };
  }, [user]);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{t('admin.cards.activeAdmins.title')}</CardTitle>
        <Users className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{activeUsers}</div>
        <p className="text-xs text-muted-foreground">{t('admin.cards.activeAdmins.description')}</p>
      </CardContent>
    </Card>
  );
}
