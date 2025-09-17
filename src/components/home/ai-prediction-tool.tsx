"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  generateRiskScore,
  type GenerateRiskScoreOutput,
} from "@/ai/flows/generate-risk-score";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, Lightbulb, Loader2, Sparkles } from "lucide-react";
import {
  ResponsiveContainer,
  RadialBarChart,
  RadialBar,
  PolarAngleAxis,
} from "recharts";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "@/hooks/use-translation";

const formSchema = (t: (key: string) => string) => z.object({
  text: z.string().min(50, {
    message: t('analyzer.form.validation.minLength'),
  }),
});

export function AIPredictionTool() {
  const [result, setResult] = useState<GenerateRiskScoreOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { t } = useTranslation();

  const form = useForm<z.infer<ReturnType<typeof formSchema>>>({
    resolver: zodResolver(formSchema(t)),
    defaultValues: {
      text: "",
    },
  });

  async function onSubmit(values: z.infer<ReturnType<typeof formSchema>>) {
    setIsLoading(true);
    setResult(null);
    try {
      const aiResult = await generateRiskScore({ text: values.text });
      setResult(aiResult);
    } catch (error) {
      console.error("AI risk score generation failed:", error);
      toast({
        variant: "destructive",
        title: t('analyzer.toast.error.title'),
        description: t('analyzer.toast.error.description'),
      });
    } finally {
      setIsLoading(false);
    }
  }

  const getScoreColor = (score: number) => {
    if (score > 75) return "hsl(var(--destructive))";
    if (score > 40) return "hsl(var(--accent))";
    return "hsl(var(--primary))";
  };

  return (
    <Card className="w-full max-w-4xl mx-auto shadow-lg">
      <CardHeader className="text-center">
        <CardTitle className="font-headline text-2xl md:text-3xl flex items-center justify-center gap-2">
          <Sparkles className="h-8 w-8 text-primary" />
          {t('analyzer.title')}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-8">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="text"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg">
                    {t('analyzer.form.label')}
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder={t('analyzer.form.placeholder')}
                      className="min-h-[150px] text-base"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isLoading} className="w-full md:w-auto">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t('analyzer.form.button.loading')}
                </>
              ) : (
                t('analyzer.form.button.default')
              )}
            </Button>
          </form>
        </Form>

        {result && (
          <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">
            <Card className="md:col-span-1 flex flex-col items-center justify-center bg-secondary/50">
              <CardHeader>
                <CardTitle className="text-center text-xl">
                  {t('analyzer.result.riskScore.title')}
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-grow flex items-center justify-center w-full h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RadialBarChart
                    innerRadius="70%"
                    outerRadius="90%"
                    data={[{ value: result.riskScore }]}
                    startAngle={90}
                    endAngle={-270}
                  >
                    <PolarAngleAxis
                      type="number"
                      domain={[0, 100]}
                      angleAxisId={0}
                      tick={false}
                    />
                    <RadialBar
                      background
                      dataKey="value"
                      cornerRadius={10}
                      fill={getScoreColor(result.riskScore)}
                    />
                    <text
                      x="50%"
                      y="50%"
                      textAnchor="middle"
                      dominantBaseline="middle"
                      className="text-4xl font-bold fill-foreground"
                    >
                      {`${result.riskScore}`}
                    </text>
                    <text
                      x="50%"
                      y="65%"
                      textAnchor="middle"
                      dominantBaseline="middle"
                      className="text-sm fill-muted-foreground"
                    >
                      / 100
                    </text>
                  </RadialBarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <div className="md:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-xl">
                    <Lightbulb className="text-primary" />
                    {t('analyzer.result.explanation.title')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{result.explanation}</p>
                </CardContent>
              </Card>

              <Card className="bg-accent/20 border-accent">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-xl text-accent-foreground">
                    <AlertTriangle className="text-accent-foreground" />
                    {t('analyzer.result.actions.title')}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-accent-foreground/90">{result.suggestedActions}</p>
                  {result.riskScore > 40 && (
                     <Button asChild className="bg-accent text-accent-foreground hover:bg-accent/90">
                        <Link href="/schedule">{t('analyzer.result.actions.button')}</Link>
                     </Button>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
