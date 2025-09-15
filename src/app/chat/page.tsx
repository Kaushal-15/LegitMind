'use client';

import { useState, useRef, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Send, FileText, Languages, Bot, User, ChevronsUpDown, FileWarning, Search, BrainCircuit } from 'lucide-react';
import DashboardLayout from '@/components/dashboard/dashboard-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardHeader, CardTitle, CardContent, CardFooter, CardDescription } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { chatWithDocument } from '@/ai/flows/chat-with-document';
import { useToast } from '@/hooks/use-toast';
import { useFiles, FilesProvider } from '@/hooks/use-files';
import { ChatMessage } from '@/lib/placeholder-data';
import { Separator } from '@/components/ui/separator';

function ChatPageContent() {
  const searchParams = useSearchParams();
  const fileId = searchParams.get('fileId');
  const fileName = searchParams.get('fileName');
  const { getFileContent, getChatSession, addMessageToChat } = useFiles();
  
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (fileId) {
      const existingSession = getChatSession(fileId);
      if (existingSession && existingSession.messages.length > 0) {
        setMessages(existingSession.messages);
      } else if (fileName) {
        const initialMessage: ChatMessage = {
          role: 'assistant',
          content: `Hello! I'm ready to answer your questions about "${fileName}". How can I help you?`,
        };
        setMessages([initialMessage]);
      }
    }
  }, [fileId, fileName, getChatSession]);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({ top: scrollAreaRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading || !fileId || !fileName) return;

    const userMessage: ChatMessage = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMessage]);
    addMessageToChat(fileId, fileName, userMessage);
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
      
      const assistantMessage: ChatMessage = { role: 'assistant', content: result.answer };
      setMessages((prev) => [...prev, assistantMessage]);
      addMessageToChat(fileId, fileName, assistantMessage);

    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Could not get an answer at this time. Please try again.';
        console.error('Error chatting with document:', error);
        toast({
          variant: 'destructive',
          title: 'Error',
          description: errorMessage,
        });

        const errorResponseMessage: ChatMessage = { role: 'assistant', content: `I'm sorry, an error occurred: ${errorMessage}` }
        setMessages((prev) => [...prev, errorResponseMessage]);
        addMessageToChat(fileId, fileName, errorResponseMessage);
    } finally {
      setIsLoading(false);
    }
  };

  if (!fileId || !fileName) {
    return (
        <div className="flex h-full flex-col items-center justify-center rounded-lg border-2 border-dashed bg-card/50">
          <FileWarning className="h-16 w-16 text-muted-foreground" />
          <h2 className="mt-6 text-2xl font-headline font-semibold">
            Select a Document to Query
          </h2>
          <p className="mt-2 text-center text-muted-foreground">
            Please go to the 'My Files' page and choose a document to start asking questions.
          </p>
        </div>
    );
  }

  return (
      <div className="flex h-[calc(100vh-8rem)] flex-col gap-6">
        {/* Top Query Bar */}
        <Card className="shadow-md">
            <CardHeader>
                <CardTitle className="font-headline text-2xl flex items-center gap-3">
                    <Search className="h-6 w-6 text-accent" />
                    Ask About: {fileName}
                </CardTitle>
                 <CardDescription>
                    Use natural language to ask questions about your document. Autocomplete suggestions will appear here.
                </CardDescription>
            </CardHeader>
            <CardContent>
                 <form onSubmit={handleSendMessage} className="flex w-full items-center space-x-2">
                    <Input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="e.g., “What is the late payment penalty?”"
                        disabled={isLoading}
                        autoComplete="off"
                        className="text-base"
                    />
                    <Button type="submit" size="lg" disabled={isLoading || !input.trim()}>
                        <Send className="h-4 w-4 mr-2" />
                        Ask
                    </Button>
                </form>
            </CardContent>
        </Card>

        {/* Conversation History */}
        <Card className="flex-1 flex flex-col h-full shadow-md">
            <CardHeader className="border-b flex-row justify-between items-center">
                <div>
                    <CardTitle className="font-headline text-xl flex items-center gap-2">
                        <BrainCircuit className="h-5 w-5 text-primary" />
                        Conversation History
                    </CardTitle>
                    <CardDescription className="pt-1">
                        Review the AI's responses and cited clauses.
                    </CardDescription>
                </div>
                 <div>
                    {/* <Button variant="outline" size="sm" className="mr-2">Export as PDF</Button>
                    <Button variant="destructive" size="sm">Clear Chat</Button> */}
                </div>
            </CardHeader>
            <CardContent className="flex-1 p-0">
                <ScrollArea className="h-[45vh] p-6" ref={scrollAreaRef}>
                    <div className="space-y-8">
                    {messages.map((message, index) => (
                        <div key={index} className={`flex items-start gap-4 ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                             {message.role === 'assistant' && (
                                 <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent border-2 border-amber-300">
                                    <Bot className="h-5 w-5 text-amber-900" />
                                </div>
                             )}
                             {message.role === 'user' && (
                                 <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-secondary border">
                                    <User className="h-5 w-5 text-secondary-foreground" />
                                </div>
                             )}

                            <div className={`w-full max-w-[85%] rounded-lg text-sm`}>
                               {message.role === 'assistant' ? (
                                    <Card className="bg-primary/5 border border-primary/20">
                                        <CardContent className="p-4">
                                            <p className="text-foreground leading-relaxed">{message.content}</p>
                                            <Accordion type="single" collapsible className="w-full mt-3">
                                                <AccordionItem value="item-1" className="border-t border-primary/10">
                                                    <AccordionTrigger className="text-xs py-2 hover:no-underline">Show Cited Clause</AccordionTrigger>
                                                    <AccordionContent className="text-xs text-muted-foreground bg-secondary/50 p-3 rounded-md">
                                                        This is where the exact, highlighted clause snippet from the document would appear.
                                                    </AccordionContent>
                                                </AccordionItem>
                                            </Accordion>
                                        </CardContent>
                                    </Card>
                               ) : (
                                <div className="bg-secondary rounded-lg p-3">
                                    <p className="text-secondary-foreground">{message.content}</p>
                                </div>
                               )}
                            </div>
                        </div>
                    ))}
                     {isLoading && (
                        <div className="flex items-start gap-4">
                             <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent border-2 border-amber-300">
                                <Bot className="h-5 w-5 text-amber-900" />
                            </div>
                            <Card className="bg-primary/5 border border-primary/20 w-full max-w-[85%]">
                                 <CardContent className="p-4">
                                    <div className="flex items-center gap-1.5">
                                        <span className="h-2 w-2 rounded-full bg-muted-foreground animate-pulse delay-0"></span>
                                        <span className="h-2 w-2 rounded-full bg-muted-foreground animate-pulse delay-150"></span>
                                        <span className="h-2 w-2 rounded-full bg-muted-foreground animate-pulse delay-300"></span>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    )}
                    </div>
                </ScrollArea>
            </CardContent>
        </Card>
      </div>
  );
}


function ChatPage() {
    return (
        <DashboardLayout>
            <FilesProvider>
                <Suspense fallback={<div>Loading...</div>}>
                    <ChatPageContent />
                </Suspense>
            </FilesProvider>
        </DashboardLayout>
    )
}

export default ChatPage;

    