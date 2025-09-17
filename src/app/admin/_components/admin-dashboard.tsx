"use client";

import { useState, useEffect, useRef } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useTranslation } from "@/hooks/use-translation";
import { Users } from "lucide-react";
import { updateActiveUsers, leaveActiveUsers } from "@/app/actions/update-active-users";

export default function AdminDashboard() {
  const { t } = useTranslation();
  const [activeUsers, setActiveUsers] = useState(1);
  const userIdRef = useRef<string | null>(null);

  useEffect(() => {
    userIdRef.current = "user_" + Math.random().toString(36).substr(2, 9);
    const userId = userIdRef.current;

    const updateUser = async () => {
       try {
          const data = await updateActiveUsers(userId);
          setActiveUsers(data.count);
        } catch (error) {
          console.error("Failed to update active users:", error);
        }
    }

    updateUser();
    const interval = setInterval(updateUser, 5000);

    const handleBeforeUnload = () => {
      if (userId) {
        // Use sendBeacon as it's more reliable for leaving pages
        navigator.sendBeacon('/api/leave', JSON.stringify({ userId }));
      }
    };
    
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      clearInterval(interval);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      if (userId) {
        leaveActiveUsers(userId);
      }
    };
  }, []);

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
  )
}
