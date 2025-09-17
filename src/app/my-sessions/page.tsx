"use client";

import { useState, useEffect } from "react";
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
import { Calendar, Clock, Trash2, User } from "lucide-react";
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

interface Appointment {
  id: string;
  name: string;
  email: string;
  date: string;
  time: string;
}

export default function MySessionsPage() {
  const [sessions, setSessions] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    try {
      const storedSessions = localStorage.getItem("scheduledSessions");
      if (storedSessions) {
        setSessions(JSON.parse(storedSessions));
      }
    } catch (error) {
      console.error("Failed to load sessions from local storage", error);
       toast({
        variant: "destructive",
        title: "Error",
        description: "Could not load your scheduled sessions.",
      });
    } finally {
        setIsLoading(false);
    }
  }, [toast]);

  const cancelSession = (sessionId: string) => {
    const updatedSessions = sessions.filter((session) => session.id !== sessionId);
    localStorage.setItem("scheduledSessions", JSON.stringify(updatedSessions));
    setSessions(updatedSessions);
    toast({
        title: "Session Cancelled",
        description: "Your appointment has been successfully cancelled.",
      });
  };
  
  if (isLoading) {
    return (
        <div className="container mx-auto px-4 py-8 md:py-12 text-center">
            <p>Loading sessions...</p>
        </div>
    )
  }


  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <div className="space-y-4 text-center mb-12">
        <h1 className="font-headline text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
          My Scheduled Sessions
        </h1>
        <p className="max-w-[700px] mx-auto text-muted-foreground md:text-xl">
          Here is a list of your upcoming appointments. You can manage or cancel
          them here.
        </p>
      </div>

      {sessions.length === 0 ? (
        <Card className="w-full max-w-md mx-auto text-center py-12">
             <CardHeader>
                <CardTitle>No Sessions Found</CardTitle>
                <CardDescription>You haven't scheduled any sessions yet.</CardDescription>
             </CardHeader>
             <CardContent>
                <Button asChild>
                    <Link href="/schedule">Schedule a Session</Link>
                </Button>
             </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {sessions.sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime()).map((session) => (
            <Card key={session.id} className="flex flex-col">
              <CardHeader>
                <CardTitle className="font-headline text-xl">
                  {format(new Date(session.date), "EEEE, MMMM do")}
                </CardTitle>
                <CardDescription>Appointment Details</CardDescription>
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
                    <Button variant="destructive" className="w-full">
                      <Trash2 className="mr-2 h-4 w-4" />
                      Cancel Session
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently cancel your
                        counseling session.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Go Back</AlertDialogCancel>
                      <AlertDialogAction onClick={() => cancelSession(session.id)}>
                        Yes, Cancel Session
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
