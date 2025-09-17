'use server';

/**
 * @fileOverview This flow explains the AI's risk score assessment for a student.
 *
 * - explainRiskScore - A function that calls the flow to explain the risk score.
 * - ExplainRiskScoreInput - The input type for the explainRiskScore function.
 * - ExplainRiskScoreOutput - The return type for the explainRiskScore function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ExplainRiskScoreInputSchema = z.object({
  text: z.string().describe('The text input used to generate the risk score.'),
  riskScore: z.number().describe('The risk score that needs explanation.'),
});
export type ExplainRiskScoreInput = z.infer<typeof ExplainRiskScoreInputSchema>;

const ExplainRiskScoreOutputSchema = z.object({
  explanation: z
    .string()
    .describe('The AI explanation of why the risk score was assigned.'),
});
export type ExplainRiskScoreOutput = z.infer<typeof ExplainRiskScoreOutputSchema>;

export async function explainRiskScore(input: ExplainRiskScoreInput): Promise<ExplainRiskScoreOutput> {
  return explainRiskScoreFlow(input);
}

const prompt = ai.definePrompt({
  name: 'explainRiskScorePrompt',
  input: {schema: ExplainRiskScoreInputSchema},
  output: {schema: ExplainRiskScoreOutputSchema},
  prompt: `You are an AI expert in explaining risk scores of student mental health.

You have assigned a risk score of {{riskScore}} to the following text:

{{text}}

Explain why you assigned this risk score. Be specific about the factors that contributed to the score.
`,
});

const explainRiskScoreFlow = ai.defineFlow(
  {
    name: 'explainRiskScoreFlow',
    inputSchema: ExplainRiskScoreInputSchema,
    outputSchema: ExplainRiskScoreOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
