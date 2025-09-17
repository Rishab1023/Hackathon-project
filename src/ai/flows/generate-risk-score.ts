'use server';

/**
 * @fileOverview AI flow to generate a mental health risk score from student-provided text.
 *
 * - generateRiskScore - A function that analyzes text and returns a risk score with suggested actions.
 * - GenerateRiskScoreInput - The input type for the generateRiskScore function.
 * - GenerateRiskScoreOutput - The return type for the generateRiskScore function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateRiskScoreInputSchema = z.object({
  text: z
    .string()
    .describe(
      'The text provided by the student that needs to be analyzed for mental health risk.'
    ),
});
export type GenerateRiskScoreInput = z.infer<typeof GenerateRiskScoreInputSchema>;

const GenerateRiskScoreOutputSchema = z.object({
  riskScore: z
    .number()
    .describe(
      'A numerical score indicating the level of mental health risk (e.g., 0-100).'
    ),
  explanation: z.string().describe('Explaination of the risk score'),
  suggestedActions: z
    .string()
    .describe(
      'Suggested actions or interventions based on the risk score, such as contacting a counselor or providing resources.'
    ),
});
export type GenerateRiskScoreOutput = z.infer<typeof GenerateRiskScoreOutputSchema>;

export async function generateRiskScore(
  input: GenerateRiskScoreInput
): Promise<GenerateRiskScoreOutput> {
  return generateRiskScoreFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateRiskScorePrompt',
  input: {schema: GenerateRiskScoreInputSchema},
  output: {schema: GenerateRiskScoreOutputSchema},
  prompt: `You are an AI mental health assistant tasked with analyzing student text and determining the level of mental health risk.

Analyze the following text and provide a risk score from 0-100, with 0 indicating no risk and 100 indicating a severe risk. Also provide an explanation for the risk score and suggested actions to take.

Text: {{{text}}}`,
});

const generateRiskScoreFlow = ai.defineFlow(
  {
    name: 'generateRiskScoreFlow',
    inputSchema: GenerateRiskScoreInputSchema,
    outputSchema: GenerateRiskScoreOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
