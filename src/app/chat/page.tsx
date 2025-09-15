'use client';

import { useState, useRef, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Send, FileText, Languages, Bot, User } from 'lucide-react';
import DashboardLayout from '@/components/dashboard/dashboard-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardHeader, CardTitle, CardContent, CardFooter, CardDescription } from '@/components/ui/card';
import { chatWithDocument } from '@/ai/flows/chat-with-document';
import { useToast } from '@/hooks/use-toast';
import { useFiles, FilesProvider } from '@/hooks/use-files';

type Message = {
  role: 'user' | 'assistant';
  content: string;
};

function ChatPageContent() {
  const searchParams = useSearchParams();
  const fileId = searchParams.get('fileId');
  const fileName = searchParams.get('fileName');
  const { getFileContent } = useFiles();
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (fileName) {
      setMessages([
        {
          role: 'assistant',
          content: `Hello! I'm ready to answer your questions about "${fileName}". I can understand and respond in various Indian languages. How can I help you?`,
        },
      ]);
    }
  }, [fileName]);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({ top: scrollAreaRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading || !fileId) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const documentContext = getFileContent(fileId);
      if (!documentContext) {
        throw new Error("Could not retrieve document content.");
      }

      const result = await chatWithDocument({
        documentContext,
        question: input,
      });
      setMessages((prev) => [...prev, { role: 'assistant', content: result.answer }]);
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Could not get an answer at this time. Please try again.';
        console.error('Error chatting with document:', error);
        toast({
          variant: 'destructive',
          title: 'Error',
          description: errorMessage,
        });
        setMessages((prev) => [...prev, { role: 'assistant', content: `I'm sorry, an error occurred: ${errorMessage}` }]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!fileId || !fileName) {
    return (
        <div className="flex h-full flex-col items-center justify-center rounded-lg border-2 border-dashed bg-card">
          <FileText className="h-16 w-16 text-muted-foreground" />
          <h2 className="mt-6 text-2xl font-headline font-semibold">
            Select a Document to Chat
          </h2>
          <p className="mt-2 text-center text-muted-foreground">
            Please go to the 'My Files' page and choose a document to start a conversation.
          </p>
        </div>
    );
  }

  return (
      <div className="flex h-[calc(100vh-8rem)] flex-col">
        <Card className="flex-1 flex flex-col h-full">
            <CardHeader className="border-b">
                <CardTitle className="font-headline text-xl flex items-center gap-2">
                    <FileText className="h-5 w-5 text-primary" />
                    Chat with: {fileName}
                </CardTitle>
                <CardDescription className="flex items-center gap-1.5 pt-1">
                    <Languages className="h-4 w-4" />
                    Supports English and Indian regional languages.
                </CardDescription>
            </CardHeader>
            <CardContent className="flex-1 p-0">
                <ScrollArea className="h-full p-6" ref={scrollAreaRef}>
                    <div className="space-y-6">
                    {messages.map((message, index) => (
                        <div key={index} className={`flex items-start gap-3 ${message.role === 'user' ? 'justify-end' : ''}`}>
                             {message.role === 'assistant' && <Avatar icon={<Bot />} />}
                            <div className={`max-w-[80%] rounded-lg px-4 py-2 text-sm ${message.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'}`}>
                                {message.content}
                            </div>
                            {message.role === 'user' && <Avatar icon={<User />} />}
                        </div>
                    ))}
                     {isLoading && (
                        <div className="flex items-start gap-3">
                            <Avatar icon={<Bot />} />
                            <div className="max-w-[80%] rounded-lg px-4 py-2 text-sm bg-secondary">
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
            <CardFooter className="border-t pt-6">
                <form onSubmit={handleSendMessage} className="flex w-full items-center space-x-2">
                    <Input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Ask a question in any supported language..."
                        disabled={isLoading}
                        autoComplete="off"
                    />
                    <Button type="submit" size="icon" disabled={isLoading || !input.trim()}>
                        <Send className="h-4 w-4" />
                        <span className="sr-only">Send</span>
                    </Button>
                </form>
            </CardFooter>
        </Card>
      </div>
  );
}

function ChatPage() {
    return (
        <DashboardLayout>
            <FilesProvider>
                <ChatPageContent />
            </FilesProvider>
        </DashboardLayout>
    )
}

const Avatar = ({ icon }: { icon: React.ReactNode }) => (
    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted border">
        {icon}
    </div>
);

export default ChatPage;
