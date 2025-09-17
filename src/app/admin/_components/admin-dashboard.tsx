"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useTranslation } from "@/hooks/use-translation";
import { Users } from "lucide-react";

// Mock implementation since Vercel KV is removed.
function useActiveUsers() {
    const [activeUsers, setActiveUsers] = useState(1);

    useEffect(() => {
        // In a real app, you might use WebSockets or another method.
        // For now, we'll just show a static number.
        const interval = setInterval(() => {
            // Fluctuate the number slightly for demo purposes
            setActiveUsers(prev => (prev > 1 ? prev - 1 : 1) + Math.floor(Math.random() * 2));
        }, 5000);

        return () => clearInterval(interval);
    }, []);

    return activeUsers;
}


export default function AdminDashboard() {
  const { t } = useTranslation();
  const activeUsers = useActiveUsers();

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
