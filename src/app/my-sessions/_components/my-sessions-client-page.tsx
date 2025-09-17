"use client";

import { useState, useEffect, useCallback } from "react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Clock, Trash2, User, Loader2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "@/hooks/use-translation";
import type { Appointment } from "@/lib/types";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";

const SESSIONS_STORAGE_KEY = "sessions";

export default function MySessionsClientPage() {
  const [sessions, setSessions] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCancelling, setIsCancelling] = useState<string | null>(null);
  const { toast } = useToast();
  const { t } = useTranslation();
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const fetchSessions = useCallback(async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      const storedData = localStorage.getItem(SESSIONS_STORAGE_KEY);
      const allSessions: Appointment[] = storedData ? JSON.parse(storedData) : [];
      const userSessions = allSessions.filter(session => session.userId === user.uid);
      setSessions(userSessions.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()));
    } catch (error) {
      console.error("Failed to load sessions from localStorage:", error);
      toast({
          variant: "destructive",
          title: t('mySessions.toast.loadError.title'),
          description: t('mySessions.toast.loadError.description'),
      });
    } finally {
      setIsLoading(false);
    }
  }, [user, toast, t]);


  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if(user) {
      fetchSessions();
    }
  }, [fetchSessions, user]);

  const cancelSession = async (sessionId: string) => {
    setIsCancelling(sessionId);
    try {
      const storedData = localStorage.getItem(SESSIONS_STORAGE_KEY);
      let allSessions: Appointment[] = storedData ? JSON.parse(storedData) : [];
      const updatedSessions = allSessions.filter(session => session._id !== sessionId);
      localStorage.setItem(SESSIONS_STORAGE_KEY, JSON.stringify(updatedSessions));

      // Manually trigger a storage event to notify other components (like admin page)
      window.dispatchEvent(new StorageEvent('storage', {
        key: SESSIONS_STORAGE_KEY,
        newValue: JSON.stringify(updatedSessions)
      }));

      toast({
          title: t('mySessions.toast.cancelSuccess.title'),
          description: t('mySessions.toast.cancelSuccess.description'),
      });
      await fetchSessions(); // Re-fetch to update the UI
    } catch (error) {
      console.error("Failed to cancel session in localStorage", error);
      toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to cancel the session. Please try again.",
      });
    } finally {
        setIsCancelling(null);
    }
  };
  
  if (authLoading || !user) {
    return (
        <div className="flex h-screen items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin" />
        </div>
    )
  }

  if (isLoading) {
    return (
        <div className="flex h-screen items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin" />
        </div>
    )
  }


  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <div className="space-y-4 text-center mb-12">
        <h1 className="font-headline text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
          {t('mySessions.title')}
        </h1>
        <p className="max-w-[700px] mx-auto text-muted-foreground md:text-xl">
          {t('mySessions.description')}
        </p>
      </div>

      {sessions.length === 0 ? (
        <Card className="w-full max-w-md mx-auto text-center py-12">
             <CardHeader>
                <CardTitle>{t('mySessions.noSessions.title')}</CardTitle>
                <CardDescription>{t('mySessions.noSessions.description')}</CardDescription>
             </CardHeader>
             <CardContent>
                <Button asChild>
                    <Link href="/schedule">{t('mySessions.noSessions.button')}</Link>
                </Button>
             </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {sessions.map((session) => (
            <Card key={session._id} className="flex flex-col">
              <CardHeader>
                <CardTitle className="font-headline text-xl">
                  {format(new Date(session.date), "EEEE, MMMM do")}
                </CardTitle>
                <CardDescription>{t('mySessions.card.details')}</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow space-y-3">
                 <div className="flex items-center gap-3">
                    <Clock className="h-5 w-5 text-primary" />
                    <span className="font-medium">{session.time}</span>
                 </div>
                 <div className="flex items-center gap-3">
                    <User className="h-5 w-5 text-primary" />
                    <span className="text-muted-foreground">{session.name}</span>
                 </div>
              </CardContent>
              <CardFooter>
                 <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" className="w-full" disabled={isCancelling === session._id}>
                      {isCancelling === session._id ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Trash2 className="mr-2 h-4 w-4" />}
                      {t('mySessions.card.cancelButton')}
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>{t('mySessions.dialog.title')}</AlertDialogTitle>
                      <AlertDialogDescription>
                        {t('mySessions.dialog.description')}
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>{t('mySessions.dialog.cancel')}</AlertDialogCancel>
                      <AlertDialogAction onClick={() => cancelSession(session._id!)}>
                        {t('mySessions.dialog.confirm')}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
