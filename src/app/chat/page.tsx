'use client';

import {useState, useRef, useEffect, type FormEvent} from 'react';
import {peerSupportChat} from '@/ai/flows/peer-chat';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {Card, CardContent} from '@/components/ui/card';
import {ScrollArea} from '@/components/ui/scroll-area';
import {Avatar, AvatarFallback, AvatarImage} from '@/components/ui/avatar';
import {Send, User} from 'lucide-react';
import {cn} from '@/lib/utils';
import type {Message} from '@/lib/types';
import {readStreamableValue} from 'ai/rsc';
import { useTranslation } from "@/hooks/use-translation";

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { t } = useTranslation();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const newMessages: Message[] = [...messages, {role: 'user', content: input}];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    try {
      const result = await peerSupportChat({
        history: newMessages.map(m => ({role: m.role, content: m.content})),
      });

      let assistantResponse = '';
      setMessages(prev => [...prev, {role: 'model', content: ''}]);
      
      for await (const delta of readStreamableValue(result)) {
        assistantResponse += delta;
        setMessages(prev => {
          const lastMessage = prev[prev.length - 1];
          if (lastMessage.role === 'model') {
            return [
              ...prev.slice(0, -1),
              {role: 'model', content: assistantResponse},
            ];
          }
          return prev;
        });
      }
    } catch (error) {
      console.error('Error during chat stream:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({
        top: scrollAreaRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [messages]);

  return (
    <div className="container mx-auto flex h-[calc(100vh-6rem)] max-h-full flex-col px-4 py-8 md:py-12">
      <div className="space-y-2 text-center mb-8">
        <h1 className="font-headline text-4xl font-bold tracking-tighter sm:text-5xl">
          {t('chat.title')}
        </h1>
        <p className="max-w-[600px] mx-auto text-muted-foreground md:text-xl">
          {t('chat.description')}
        </p>
      </div>

      <Card className="flex flex-1 flex-col shadow-lg">
        <CardContent className="flex flex-1 flex-col p-0">
          <ScrollArea className="flex-1 p-6" ref={scrollAreaRef}>
            <div className="space-y-6">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={cn(
                    'flex items-start gap-3',
                    message.role === 'user' ? 'justify-end' : 'justify-start'
                  )}
                >
                  {message.role === 'model' && (
                    <Avatar className="h-9 w-9 border">
                      <AvatarImage src="https://picsum.photos/seed/alex-avatar/100" alt="Alex" />
                      <AvatarFallback>A</AvatarFallback>
                    </Avatar>
                  )}
                  <div
                    className={cn(
                      'max-w-[75%] rounded-lg p-3 text-sm',
                      message.role === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted'
                    )}
                  >
                    <p>{message.content}</p>
                  </div>
                   {message.role === 'user' && (
                     <Avatar className="h-9 w-9 border">
                       <AvatarFallback>
                         <User className='h-5 w-5' />
                       </AvatarFallback>
                     </Avatar>
                   )}
                </div>
              ))}
               {isLoading && messages.length > 0 && messages[messages.length -1].role === 'user' && (
                <div className="flex items-start gap-3 justify-start">
                  <Avatar className="h-9 w-9 border">
                    <AvatarImage src="https://picsum.photos/seed/alex-avatar/100" alt="Alex" />
                    <AvatarFallback>A</AvatarFallback>
                  </Avatar>
                  <div className="bg-muted rounded-lg p-3 text-sm">
                    <div className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-muted-foreground animate-pulse delay-0"></span>
                        <span className="h-2 w-2 rounded-full bg-muted-foreground animate-pulse delay-150"></span>
                        <span className="h-2 w-2 rounded-full bg-muted-foreground animate-pulse delay-300"></span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
          <div className="border-t p-4">
            <form onSubmit={handleSubmit} className="flex items-center gap-3">
              <Input
                value={input}
                onChange={handleInputChange}
                placeholder={t('chat.inputPlaceholder')}
                className="flex-1"
                disabled={isLoading}
              />
              <Button type="submit" size="icon" disabled={isLoading || !input.trim()}>
                <Send className="h-5 w-5" />
                <span className="sr-only">{t('chat.send')}</span>
              </Button>
            </form>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
