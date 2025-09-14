'use client';
import { useState } from 'react';
import { Sparkles, HelpCircle, Send } from 'lucide-react';
import { guidanceToolUpload } from '@/ai/flows/guidance-tool-upload';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription
} from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';

type Message = {
  role: 'user' | 'assistant';
  content: string;
};

export function GuidanceTool() {
  const [question, setQuestion] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleAskQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim() || isLoading) return;

    const newMessages: Message[] = [...messages, { role: 'user', content: question }];
    setMessages(newMessages);
    setQuestion('');
    setIsLoading(true);

    try {
      const result = await guidanceToolUpload({ question });
      setMessages([...newMessages, { role: 'assistant', content: result.answer }]);
    } catch (error) {
      console.error('Error getting guidance:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Could not get guidance at this time. Please try again later.',
      });
       // Add error message to chat
       setMessages([...newMessages, { role: 'assistant', content: "I'm sorry, I'm having trouble responding right now. Please try again in a moment." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="space-y-1.5">
            <CardTitle className="flex items-center gap-2">
            <HelpCircle className="h-6 w-6 text-accent" />
            <span className="font-headline">Guidance Tool</span>
            </CardTitle>
            <CardDescription>
                Ask a question about the upload process.
            </CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-48 w-full pr-4">
          <div className="space-y-4">
            {messages.length === 0 && (
                <div className="text-center text-sm text-muted-foreground pt-12">
                    <p>e.g., "What's the maximum file size?"</p>
                </div>
            )}
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex gap-2 text-sm ${
                  message.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                {message.role === 'assistant' && (
                    <Sparkles className="h-5 w-5 text-accent shrink-0 mt-0.5" />
                )}
                <div
                  className={`max-w-[80%] rounded-lg px-3 py-2 ${
                    message.role === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-secondary'
                  }`}
                >
                  {message.content}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex gap-2 text-sm justify-start">
                 <Sparkles className="h-5 w-5 text-accent shrink-0 mt-0.5" />
                 <div className="max-w-[80%] rounded-lg px-3 py-2 bg-secondary">
                    <div className="flex items-center gap-1.5">
                        <span className="h-2 w-2 rounded-full bg-muted-foreground animate-pulse delay-0"></span>
                        <span className="h-2 w-2 rounded-full bg-muted-foreground animate-pulse delay-150"></span>
                        <span className="h-2 w-2 rounded-full bg-muted-foreground animate-pulse delay-300"></span>
                    </div>
                 </div>
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
      <CardFooter>
        <form onSubmit={handleAskQuestion} className="flex w-full items-center space-x-2">
          <Input
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Type your question..."
            disabled={isLoading}
          />
          <Button type="submit" size="icon" disabled={isLoading || !question.trim()}>
            <Send className="h-4 w-4" />
            <span className="sr-only">Send</span>
          </Button>
        </form>
      </CardFooter>
    </Card>
  );
}
