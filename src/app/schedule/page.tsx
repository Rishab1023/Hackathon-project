"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon, CheckCircle } from "lucide-react";
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

const availableTimes = [
  "09:00 AM",
  "10:00 AM",
  "11:00 AM",
  "02:00 PM",
  "03:00 PM",
  "04:00 PM",
];

export default function SchedulePage() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [selectedTime, setSelectedTime] = useState<string | undefined>();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [allSessions, setAllSessions] = useState<Appointment[]>([]);
  const { toast } = useToast();
  const { t } = useTranslation();

  useEffect(() => {
    try {
      const storedSessions = localStorage.getItem("scheduledSessions");
      if (storedSessions) {
        setAllSessions(JSON.parse(storedSessions));
      }
    } catch (error) {
      console.error("Failed to load sessions from local storage", error);
    }
  }, []);

  const getBookedTimesForDate = (selectedDate: Date | undefined) => {
    if (!selectedDate) return [];
    return allSessions
      .filter(session => format(new Date(session.date), "yyyy-MM-dd") === format(selectedDate, "yyyy-MM-dd"))
      .map(session => session.time);
  };
  
  const bookedTimes = getBookedTimesForDate(date);


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!date || !selectedTime || !name || !email) {
      toast({
        variant: "destructive",
        title: t('schedule.toast.incomplete.title'),
        description: t('schedule.toast.incomplete.description'),
      });
      return;
    }
    
    let riskAnalysis;
    try {
        const storedAnalysis = localStorage.getItem("latestRiskAnalysis");
        if (storedAnalysis) {
            const parsedAnalysis = JSON.parse(storedAnalysis);
            // Check if the analysis was done in the last 10 minutes
            const tenMinutes = 10 * 60 * 1000;
            if (new Date().getTime() - new Date(parsedAnalysis.timestamp).getTime() < tenMinutes) {
                riskAnalysis = parsedAnalysis;
            }
        }
    } catch (error) {
        console.error("Could not retrieve risk analysis from local storage", error);
    }
    
    const newAppointment: Appointment = {
      id: new Date().toISOString(),
      name,
      email,
      date: date.toISOString(),
      time: selectedTime,
      riskScore: riskAnalysis?.riskScore,
    };
    
    try {
        const storedSessions = localStorage.getItem("scheduledSessions");
        const sessions = storedSessions ? JSON.parse(storedSessions) : [];
        const updatedSessions = [...sessions, newAppointment];
        localStorage.setItem("scheduledSessions", JSON.stringify(updatedSessions));
        setAllSessions(updatedSessions); // Update the state with the new session
        
        // Clear the used risk analysis
        if(riskAnalysis) {
            localStorage.removeItem("latestRiskAnalysis");
        }

        setIsSubmitted(true);
    } catch (error) {
        console.error("Failed to save session to local storage", error);
        toast({
            variant: "destructive",
            title: t('schedule.toast.failed.title'),
            description: t('schedule.toast.failed.description'),
        });
    }
  };
  
  const handleDateChange = (newDate: Date | undefined) => {
    setDate(newDate);
    setSelectedTime(undefined); // Reset time when date changes
  };
  
  const resetForm = () => {
    setDate(new Date());
    setSelectedTime(undefined);
    setName("");
    setEmail("");
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
                        {t('schedule.success.confirmation', { date: format(date!, "EEEE, MMMM do"), time: selectedTime })}
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
                    onValueChange={setSelectedTime}
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
                            disabled={isBooked}
                          />
                          <Label
                            htmlFor={time}
                            className={cn(
                              "flex items-center justify-center rounded-md border-2 border-muted bg-popover p-2 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary",
                              isBooked && "cursor-not-allowed bg-muted/50 text-muted-foreground line-through opacity-70"
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
            <Button type="submit" className="w-full" disabled={!date || !selectedTime || !name || !email}>
              {t('schedule.form.submitButton')}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
