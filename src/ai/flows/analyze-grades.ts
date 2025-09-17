'use server';

/**
 * @fileOverview An AI flow to analyze student grades and predict if they are struggling.
 *
 * - analyzeGrades - A function that analyzes grades and returns a prediction and recommendations.
 * - AnalyzeGradesInput - The input type for the analyzeGrades function.
 * - AnalyzeGradesOutput - The return type for the analyzeGrades function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

export const AnalyzeGradesInputSchema = z.object({
  studentName: z.string().describe("The student's name."),
  grades: z.string().describe('A string of subjects and grades, e.g., "Math: 85, Science: 70, English: 91".'),
});
export type AnalyzeGradesInput = z.infer<typeof AnalyzeGradesInputSchema>;

export const AnalyzeGradesOutputSchema = z.object({
  isStruggling: z
    .boolean()
    .describe('Whether the student is predicted to be struggling.'),
  performanceSummary: z
    .string()
    .describe("A summary of the student's academic performance."),
  recommendations: z
    .string()
    .describe('Recommendations for the student, parents, or teachers.'),
});
export type AnalyzeGradesOutput = z.infer<typeof AnalyzeGradesOutputSchema>;

export async function analyzeGrades(
  input: AnalyzeGradesInput
): Promise<AnalyzeGradesOutput> {
  return analyzeGradesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeGradesPrompt',
  input: {schema: AnalyzeGradesInputSchema},
  output: {schema: AnalyzeGradesOutputSchema},
  prompt: `You are an expert AI educational analyst. Your role is to analyze a student's grades to identify if they are struggling academically.

Analyze the grades for the student named {{studentName}}. The grades are: {{grades}}.

Based on the grades:
1. Determine if the student is struggling. A student is generally considered struggling if they have one or more grades below 70, or a mix of high and very low grades indicating inconsistency.
2. Provide a brief performance summary.
3. Offer actionable recommendations for the student, and potentially their parents or teachers.
`,
});

const analyzeGradesFlow = ai.defineFlow(
  {
    name: 'analyzeGradesFlow',
    inputSchema: AnalyzeGradesInputSchema,
    outputSchema: AnalyzeGradesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
