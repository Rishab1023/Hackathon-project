"use client";

import { useState, useEffect, useCallback } from "react";
import { format, addDays, startOfTomorrow } from "date-fns";
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
import { useAuth } from "@/contexts/AuthContext";
import { AuthGuard } from "@/components/auth/auth-guard";
import { addScheduledSession, getScheduledTimesForDate } from "@/app/actions/schedule-actions";

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
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [bookedTimes, setBookedTimes] = useState<string[]>([]);
  const [isPriority, setIsPriority] = useState(false);
  const [riskScore, setRiskScore] = useState<number | undefined>(undefined);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingTimes, setIsLoadingTimes] = useState(false);

  const { toast } = useToast();
  const { t } = useTranslation();
  const { user } = useAuth();
  
  useEffect(() => {
    try {
      const storedAnalysis = localStorage.getItem("latestRiskAnalysis");
      if (storedAnalysis) {
        const { riskScore: score, priority } = JSON.parse(storedAnalysis);
        setRiskScore(score);
        if (priority) {
          setIsPriority(true);
        }
      }
      
      if (user) {
        setName(user.displayName || "");
        setEmail(user.email || "");
      }
    } catch (error) {
      console.error("Failed to load initial data from localStorage", error);
    }
  }, [user]);

  const findAndSetEarliestSlot = useCallback(async () => {
    setIsLoadingTimes(true);
    let earliestDate: Date | undefined = undefined;
    let earliestTime: string | undefined = undefined;

    // Search for the next 30 days
    for (let i = 0; i < 30; i++) {
        const checkDate = addDays(new Date(), i);
        // Skip weekends
        if (checkDate.getDay() === 0 || checkDate.getDay() === 6) {
            continue;
        }

        try {
            const times = await getScheduledTimesForDate(checkDate);
            const firstAvailableTime = availableTimes.find(time => !times.includes(time));

            if (firstAvailableTime) {
                earliestDate = checkDate;
                earliestTime = firstAvailableTime;
                setBookedTimes(times);
                break; // Found the earliest slot
            }
        } catch (error) {
            console.error("Error fetching times for priority booking:", error);
            // Continue to the next day
        }
    }

    if (earliestDate && earliestTime) {
        setDate(earliestDate);
        setSelectedTime(earliestTime);
    } else {
         toast({
            variant: "destructive",
            title: "No available slots",
            description: "We couldn't find any available appointment slots in the next 30 days.",
        });
    }
    setIsLoadingTimes(false);
  }, [toast]);

  useEffect(() => {
    if (isPriority) {
        findAndSetEarliestSlot();
    }
  }, [isPriority, findAndSetEarliestSlot]);


  const fetchBookedTimes = useCallback(async (selectedDate: Date) => {
    setIsLoadingTimes(true);
    try {
      const times = await getScheduledTimesForDate(selectedDate);
      setBookedTimes(times);
    } catch (error) {
      console.error("Failed to fetch booked times from Firestore", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Could not load available times for the selected date.",
      });
    } finally {
      setIsLoadingTimes(false);
    }
  }, [toast]);

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

    setIsSubmitting(true);

    try {
        // Final check to prevent double booking
        const currentBookedTimes = await getScheduledTimesForDate(date);
        if (currentBookedTimes.includes(selectedTime)) {
            toast({
              variant: "destructive",
              title: "Time slot unavailable",
              description: "This time slot has just been booked. Please select another time.",
            });
            setBookedTimes(currentBookedTimes);
            if (isPriority) {
              await findAndSetEarliestSlot();
            }
            setIsSubmitting(false);
            return;
        }

        const newAppointment = {
            name,
            email,
            date: date.toISOString(),
            time: selectedTime,
            userId: user.uid,
            ...(riskScore !== undefined && { riskScore }),
        };
        
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
    } finally {
        setIsSubmitting(false);
    }
  };
  
  const handleDateChange = (newDate: Date | undefined) => {
    if(isPriority) return; // Don't allow date change in priority mode
    setDate(newDate);
    setSelectedTime(undefined); // Reset time when date changes
    setBookedTimes([]);
    if (newDate) {
      fetchBookedTimes(newDate);
    }
  };
  
  const resetForm = () => {
    setDate(undefined);
    setSelectedTime(undefined);
    setName(user?.displayName || "");
    setEmail(user?.email || "");
    setRiskScore(undefined);
    setIsPriority(false);
    setIsSubmitted(false);
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
                        {date && selectedTime ? t('schedule.success.confirmation', { date: format(date, "EEEE, MMMM do"), time: selectedTime }) : ''}
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
                          Based on your analysis, we've pre-selected the earliest available appointment for you. Please confirm the details below.
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
                        disabled={isPriority || isLoadingTimes}
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
                   {(!date || isLoadingTimes) && (
                     <div className="h-full flex items-center justify-center p-2 border rounded-md min-h-[100px]">
                        {isPriority || isLoadingTimes ? <Loader2 className="h-6 w-6 animate-spin" /> : <div className="text-sm text-muted-foreground">Please select a date first.</div>}
                     </div>
                   )}
                   {date && !isLoadingTimes && (
                    <RadioGroup
                        value={selectedTime}
                        onValueChange={(value) => setSelectedTime(value)}
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
                                disabled={isBooked || isPriority}
                              />
                              <Label
                                htmlFor={time}
                                className={cn(
                                  "flex items-center justify-center rounded-md border-2 border-muted bg-popover p-2 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary",
                                  (isBooked || (isPriority && selectedTime !== time)) && "cursor-not-allowed bg-muted/50 text-muted-foreground opacity-70",
                                  isBooked && "line-through"
                                )}
                              >
                                {time}
                              </Label>
                            </div>
                          )
                        })}
                      </RadioGroup>
                   )}
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
                          <Input id="email" type="email" placeholder={t('schedule.form.emailPlaceholder')} value={email} onChange={e => setEmail(e.target.value)} required readOnly/>
                      </div>
                  </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full" disabled={!date || !selectedTime || !name || !email || isSubmitting || isLoadingTimes}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {t('schedule.form.submitButton')}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </AuthGuard>
  );
}
