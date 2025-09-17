'use server';

/**
 * @fileOverview A streaming AI flow for a peer support chat.
 *
 * - peerSupportChat - A function that streams responses from an AI peer supporter.
 * - PeerSupportChatInput - The input type for the peerSupportChat function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PeerSupportChatInputSchema = z.object({
  history: z
    .array(z.object({role: z.enum(['user', 'model']), content: z.string()}))
    .describe('The chat history between the user and the model.'),
});

export type PeerSupportChatInput = z.infer<typeof PeerSupportChatInputSchema>;

export async function peerSupportChat(input: PeerSupportChatInput) {
  const prompt = `You are a friendly and empathetic peer supporter in a university mental health support system. Your name is Alex. You are not a licensed therapist, but a student who is trained to listen and provide a safe space for others to share what's on their mind.

Keep your responses concise, warm, and encouraging. Use emojis where appropriate to convey warmth. Your goal is to make the user feel heard and understood. Do not give medical advice. If the user seems to be in serious distress, gently suggest they consider scheduling a session with a professional counselor through the university's services or contacting a crisis hotline.

Here is the conversation history:
{{#each history}}
{{#if (eq role 'user')}}
User: {{{content}}}
{{else}}
Alex: {{{content}}}
{{/if}}
{{/each}}
Alex:`;

  const {stream} = ai.generateStream({
    prompt: prompt,
    history: input.history,
    config: {
      temperature: 0.7,
    },
  });

  return stream;
}
