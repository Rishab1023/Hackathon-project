"use client";

import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useTranslation } from "@/hooks/use-translation";
import { format } from "date-fns";
import type { Appointment } from "@/lib/types";
import { Shield } from "lucide-react";

export default function AdminDashboardPage() {
  const [sessions, setSessions] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { t } = useTranslation();

  useEffect(() => {
    try {
      const storedSessions = localStorage.getItem("scheduledSessions");
      if (storedSessions) {
        const parsedSessions = JSON.parse(storedSessions) as Appointment[];
        setSessions(parsedSessions.sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
      }
    } catch (error) {
      console.error("Failed to load sessions from local storage", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getScoreVariant = (score: number) => {
    if (score > 75) return "destructive";
    if (score > 40) return "secondary";
    return "default";
  };
  
  const getScoreLabel = (score: number) => {
    if (score > 75) return t('admin.riskLevels.high');
    if (score > 40) return t('admin.riskLevels.medium');
    return t('admin.riskLevels.low');
  }

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <div className="space-y-4 text-center mb-12">
        <h1 className="font-headline text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
          {t('admin.title')}
        </h1>
        <p className="max-w-[700px] mx-auto text-muted-foreground md:text-xl">
          {t('admin.description')}
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t('admin.sessions.title')}</CardTitle>
          <CardDescription>{t('admin.sessions.description')}</CardDescription>
        </CardHeader>
        <CardContent>
            {isLoading ? (
                <p>{t('admin.loading')}</p>
            ) : sessions.length === 0 ? (
                <div className="text-center py-8">
                    <p className="text-muted-foreground">{t('admin.noSessions')}</p>
                </div>
            ) : (
                <Table>
                    <TableHeader>
                    <TableRow>
                        <TableHead>{t('admin.table.student')}</TableHead>
                        <TableHead>{t('admin.table.date')}</TableHead>
                        <TableHead>{t('admin.table.time')}</TableHead>
                        <TableHead className="text-right">{t('admin.table.riskScore')}</TableHead>
                    </TableRow>
                    </TableHeader>
                    <TableBody>
                    {sessions.map((session) => (
                        <TableRow key={session.id}>
                        <TableCell className="font-medium">{session.name}</TableCell>
                        <TableCell>{format(new Date(session.date), "PPP")}</TableCell>
                        <TableCell>{session.time}</TableCell>
                        <TableCell className="text-right">
                            {session.riskScore !== undefined && session.riskScore !== null ? (
                            <Badge variant={getScoreVariant(session.riskScore)}>
                                <Shield className="mr-1 h-3 w-3" />
                                {session.riskScore} - {getScoreLabel(session.riskScore)}
                            </Badge>
                            ) : (
                            <span className="text-muted-foreground text-xs">{t('admin.table.notAvailable')}</span>
                            )}
                        </TableCell>
                        </TableRow>
                    ))}
                    </TableBody>
                </Table>
            )}
        </CardContent>
      </Card>
    </div>
  );
}
