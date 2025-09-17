"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import {
  analyzeGrades,
  type AnalyzeGradesInput,
  type AnalyzeGradesOutput,
} from "@/ai/flows/analyze-grades";
import { Loader2, Sparkles, AlertTriangle, Lightbulb, CheckCircle } from "lucide-react";

const GradeAnalysisFormSchema = z.object({
  studentName: z.string().min(1, "Student name is required."),
  grades: z.string().min(3, "Please enter at least one grade."),
});

export default function GradeAnalysisPage() {
  const [result, setResult] = useState<AnalyzeGradesOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof GradeAnalysisFormSchema>>({
    resolver: zodResolver(GradeAnalysisFormSchema),
    defaultValues: {
      studentName: "",
      grades: "",
    },
  });

  async function onSubmit(values: z.infer<typeof GradeAnalysisFormSchema>) {
    setIsLoading(true);
    setResult(null);
    try {
      const aiResult = await analyzeGrades(values);
      setResult(aiResult);
    } catch (error) {
      console.error("AI grade analysis failed:", error);
      toast({
        variant: "destructive",
        title: "Analysis Failed",
        description:
          "There was an error analyzing the grades. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <div className="space-y-4 text-center mb-12">
        <h1 className="font-headline text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
          Student Grade Analysis
        </h1>
        <p className="max-w-[700px] mx-auto text-muted-foreground md:text-xl">
          Use our AI tool to predict if a student is struggling based on their
          grades and get actionable recommendations.
        </p>
      </div>

      <Card className="w-full max-w-2xl mx-auto shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-primary" />
            Analysis Tool
          </CardTitle>
          <CardDescription>
            Enter the student's name and their grades to get an AI-powered
            analysis.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="studentName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Student Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Jane Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="grades"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Grades</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="e.g., Math: 85, Science: 65, History: 92"
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Analyzing Grades...
                  </>
                ) : (
                  "Analyze Grades"
                )}
              </Button>
            </form>
          </Form>

          {result && (
            <div className="mt-8 space-y-6">
              <Card
                className={
                  result.isStruggling
                    ? "border-destructive bg-destructive/10"
                    : "border-primary bg-primary/10"
                }
              >
                <CardHeader>
                  <CardTitle
                    className={`flex items-center gap-2 ${
                      result.isStruggling
                        ? "text-destructive"
                        : "text-primary"
                    }`}
                  >
                    {result.isStruggling ? (
                      <AlertTriangle />
                    ) : (
                      <CheckCircle />
                    )}
                    Prediction: Student{" "}
                    {result.isStruggling ? "May Be Struggling" : "Seems Okay"}
                  </CardTitle>
                </CardHeader>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-xl">
                    <Lightbulb className="text-primary" />
                    Performance Summary
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    {result.performanceSummary}
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-accent/20 border-accent">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-xl text-accent-foreground">
                    <Sparkles className="text-accent-foreground" />
                    Recommendations
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-accent-foreground/90">
                    {result.recommendations}
                  </p>
                </CardContent>
              </Card>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
