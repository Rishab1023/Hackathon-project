
"use client";

import { useState, useEffect, useCallback } from "react";
import { format, addDays }from "date-fns";
import { Calendar as CalendarIcon, CheckCircle, AlertTriangle, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert"
import { Label } from "@/components/ui/label";
import {
  RadioGroup,
  RadioGroupItem,
} from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";
import { useTranslation } from "@/hooks/use-translation";
import type { Appointment } from "@/lib/types";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { addScheduledSession, getScheduledSessions } from "@/lib/firestore";
import { AuthGuard } from "@/components/auth/auth-guard";

const availableTimes = [
  "09:00 AM",
  "10:00 AM",
  "11:00 AM",
  "02:00 PM",
  "03:00 PM",
  "04:00 PM",
];

export default function SchedulePage() {
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState<string | undefined>();
  const [name, setName] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [allSessions, setAllSessions] = useState<Appointment[]>([]);
  const [isPriority, setIsPriority] = useState(false);
  const [riskScore, setRiskScore] = useState<number | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [email, setEmail] = useState("");


  const { toast } = useToast();
  const { t } = useTranslation();
  const { user } = useAuth();
  
  const getBookedTimesForDate = useCallback((selectedDate: Date | undefined) => {
    if (!selectedDate) return [];
    return allSessions
      .filter(session => format(new Date(session.date), "yyyy-MM-dd") === format(selectedDate, "yyyy-MM-dd"))
      .map(session => session.time);
  }, [allSessions]);
  
  useEffect(() => {
    if (!user) return;
    
    async function fetchSessions() {
        try {
            const sessions = await getScheduledSessions();
            setAllSessions(sessions);
        } catch (error) {
            console.error("Failed to fetch sessions from Firestore", error);
            toast({
                variant: "destructive",
                title: "Error",
                description: "Could not load session data. Please try again later.",
            });
        } finally {
            setIsLoading(false);
        }
    }
    
    fetchSessions();

    try {
      const storedAnalysis = localStorage.getItem("latestRiskAnalysis");
      if (storedAnalysis) {
        const { riskScore: score, priority } = JSON.parse(storedAnalysis);
        setRiskScore(score);
        if (user.displayName) {
          setName(user.displayName);
        }
        if (priority) {
          setIsPriority(true);
        }
      }
      if(user.email) {
        setEmail(user.email);
      }

    } catch (error) {
      console.error("Failed to load data from local storage", error);
    }
  }, [user, toast]);


  useEffect(() => {
    if (isPriority && allSessions.length > 0) {
      // Find the earliest available slot
      let checkDate = new Date();
      let earliestSlot: { date: Date; time: string } | null = null;

      for (let i = 0; i < 30; i++) { // Check up to 30 days in the future
        const day = checkDate.getDay();
        if (day === 0 || day === 6) { // Skip weekends
          checkDate = addDays(checkDate, 1);
          continue;
        }

        const bookedTimes = getBookedTimesForDate(checkDate);
        const available = availableTimes.filter(time => !bookedTimes.includes(time));
        
        if (available.length > 0) {
          earliestSlot = { date: checkDate, time: available[0] };
          break;
        }
        checkDate = addDays(checkDate, 1);
      }

      if (earliestSlot) {
        setDate(earliestSlot.date);
        setSelectedTime(earliestSlot.time);
      } else {
        // Handle case where no slots are available in the next 30 days
         toast({
            variant: "destructive",
            title: "No appointments available",
            description: "We couldn't find any open slots in the next 30 days. Please check back later.",
        });
        setIsPriority(false); // Revert to manual selection
      }
    }
  }, [isPriority, allSessions, getBookedTimesForDate, toast]);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!date || !selectedTime || !name || !email || !user) {
      toast({
        variant: "destructive",
        title: t('schedule.toast.incomplete.title'),
        description: t('schedule.toast.incomplete.description'),
      });
      return;
    }
    
    const newAppointment: Omit<Appointment, 'id' | 'riskScore'> & { riskScore?: number } = {
      name,
      email,
      date: date.toISOString(),
      time: selectedTime,
      userId: user.uid,
    };
    
    if (riskScore !== undefined) {
      newAppointment.riskScore = riskScore;
    }
    
    try {
        await addScheduledSession(newAppointment);
        localStorage.removeItem("latestRiskAnalysis");
        setIsSubmitted(true);
    } catch (error) {
        console.error("Failed to save session to Firestore", error);
        toast({
            variant: "destructive",
            title: t('schedule.toast.failed.title'),
            description: t('schedule.toast.failed.description'),
        });
    }
  };
  
  const handleDateChange = (newDate: Date | undefined) => {
    if(isPriority) return; // Don't allow date change in priority mode
    setDate(newDate);
    setSelectedTime(undefined); // Reset time when date changes
  };
  
  const resetForm = () => {
    setDate(undefined);
    setSelectedTime(undefined);
    setName("");
    setRiskScore(undefined);
    setIsPriority(false);
    setIsSubmitted(false);
    if (user?.email) {
      setEmail(user.email);
    }
  }

  const bookedTimes = getBookedTimesForDate(date);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (isSubmitted) {
    return (
        <div className="container mx-auto flex min-h-[calc(100vh-8rem)] items-center justify-center px-4 py-8 md:py-12">
            <Card className="w-full max-w-lg text-center shadow-lg">
                <CardHeader>
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                        <CheckCircle className="h-10 w-10 text-primary" />
                    </div>
                    <CardTitle className="font-headline text-2xl md:text-3xl pt-4">{t('schedule.success.title')}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                    <p className="text-muted-foreground">{t('schedule.success.thankYou', { name })}</p>
                    <p className="text-muted-foreground">
                        {t('schedule.success.confirmation', { date: format(date!, "EEEE, MMMM do"), time: selectedTime! })}
                    </p>
                    <p className="text-muted-foreground pt-2">{t('schedule.success.emailConfirmation', { email })}</p>
                </CardContent>
                <CardFooter className="flex-col sm:flex-row gap-2">
                     <Button className="w-full" onClick={resetForm}>{t('schedule.success.scheduleAnother')}</Button>
                     <Button variant="secondary" className="w-full" asChild>
                        <Link href="/my-sessions">{t('schedule.success.viewSessions')}</Link>
                     </Button>
                </CardFooter>
            </Card>
        </div>
    );
  }

  return (
    <AuthGuard>
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="space-y-4 text-center mb-12">
          <h1 className="font-headline text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
            {t('schedule.title')}
          </h1>
          <p className="max-w-[700px] mx-auto text-muted-foreground md:text-xl">
            {t('schedule.description')}
          </p>
        </div>

        <Card className="w-full max-w-2xl mx-auto shadow-lg">
          <form onSubmit={handleSubmit}>
            <CardHeader>
              <CardTitle>{t('schedule.form.title')}</CardTitle>
              <CardDescription>
                {t('schedule.form.description')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              {isPriority && (
                  <Alert variant="destructive">
                      <AlertTriangle className="h-4 w-4" />
                      <AlertTitle>Priority Booking</AlertTitle>
                      <AlertDescription>
                          Based on your analysis, we've pre-selected the earliest available appointment for you. Please confirm your details below.
                      </AlertDescription>
                  </Alert>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <Label className="text-base">{t('schedule.form.dateLabel')}</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !date && "text-muted-foreground"
                        )}
                        disabled={isPriority}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date ? format(date, "PPP") : <span>{t('schedule.form.datePlaceholder')}</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={handleDateChange}
                        initialFocus
                        disabled={(day) => day < new Date(new Date().setHours(0,0,0,0)) || day.getDay() === 0 || day.getDay() === 6}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="space-y-2">
                  <Label className="text-base">{t('schedule.form.timeLabel')}</Label>
                  <RadioGroup
                      value={selectedTime}
                      onValueChange={(value) => !isPriority && setSelectedTime(value)}
                      className="grid grid-cols-2 gap-2"
                    >
                      {availableTimes.map((time) => {
                        const isBooked = bookedTimes.includes(time);
                        return (
                          <div key={time}>
                            <RadioGroupItem
                              value={time}
                              id={time}
                              className="peer sr-only"
                              disabled={isBooked || (isPriority && time !== selectedTime)}
                            />
                            <Label
                              htmlFor={time}
                              className={cn(
                                "flex items-center justify-center rounded-md border-2 border-muted bg-popover p-2 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary",
                                isBooked && "cursor-not-allowed bg-muted/50 text-muted-foreground line-through opacity-70",
                                isPriority && time !== selectedTime && "cursor-not-allowed bg-muted/50 text-muted-foreground opacity-70"
                              )}
                            >
                              {time}
                            </Label>
                          </div>
                        )
                      })}
                    </RadioGroup>
                </div>
              </div>
              <div className="space-y-4">
                  <h3 className="text-base font-medium">{t('schedule.form.infoLabel')}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                          <Label htmlFor="name">{t('schedule.form.nameLabel')}</Label>
                          <Input id="name" placeholder={t('schedule.form.namePlaceholder')} value={name} onChange={e => setName(e.target.value)} required />
                      </div>
                      <div className="space-y-2">
                          <Label htmlFor="email">{t('schedule.form.emailLabel')}</Label>
                          <Input id="email" type="email" placeholder={t('schedule.form.emailPlaceholder')} value={email} onChange={e => setEmail(e.target.value)} required />
                      </div>
                  </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full" disabled={!date || !selectedTime || !name || !email || (isPriority && !selectedTime) }>
                {t('schedule.form.submitButton')}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </AuthGuard>
  );
}
