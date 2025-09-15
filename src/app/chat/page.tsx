'use client';

import { useState, useRef, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Send, FileText, Bot, User, FileWarning, Search, BrainCircuit, MessageSquare, Download } from 'lucide-react';
import DashboardLayout from '@/components/dashboard/dashboard-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { chatWithDocument } from '@/ai/flows/chat-with-document';
import { useToast } from '@/hooks/use-toast';
import { useFiles, FilesProvider } from '@/hooks/use-files';
import { ChatMessage, ChatSession, SummaryData, AnalysisData } from '@/lib/placeholder-data';
import { ExportReport } from '@/components/dashboard/export-report';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';


function ChatListPage() {
  const { chats } = useFiles();
  const router = useRouter();

  const handleSelectChat = (chat: ChatSession) => {
    router.push(`/chat?fileId=${chat.docId}&fileName=${encodeURIComponent(chat.docName)}`);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-2xl flex items-center gap-2">
            <MessageSquare className="h-6 w-6" /> Document Chats
          </CardTitle>
          <CardDescription>
            Review your past conversations with your documents.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            {chats.map((chat) => (
              <AccordionItem value={`item-${chat.docId}`} key={chat.docId} className="cursor-pointer" onClick={() => handleSelectChat(chat)}>
                <AccordionTrigger className="hover:no-underline">
                  <div className="flex items-center gap-3 text-left">
                    <FileText className="h-5 w-5 shrink-0 text-primary" />
                    <div>
                      <p className="font-medium">{chat.docName}</p>
                      <p className="text-xs text-muted-foreground">Last message: {new Date(chat.lastUpdated).toLocaleString()}</p>
                    </div>
                  </div>
                </AccordionTrigger>
              </AccordionItem>
            ))}
            {chats.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                <p>No chat history available yet.</p>
                <p>Start a conversation from the 'My Files' page to see it here.</p>
              </div>
            )}
          </Accordion>
        </CardContent>
      </Card>
    </div>
  );
}


function ChatDetailPage() {
  const searchParams = useSearchParams();
  const fileId = searchParams.get('fileId');
  const fileName = searchParams.get('fileName');
  const { getFileContent, getChatSession, addMessageToChat, clearChat, getSummary, getAnalysis } = useFiles();
  
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [summary, setSummary] = useState<SummaryData | null>(null);
  const [analysis, setAnalysis] = useState<AnalysisData | null>(null);

  const { toast } = useToast();
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const reportRef = useRef<HTMLDivElement>(null);


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
      setSummary(getSummary(fileId) ?? null);
      setAnalysis(getAnalysis(fileId) ?? null);
    }
  }, [fileId, fileName, getChatSession, getSummary, getAnalysis]);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({ top: scrollAreaRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [messages]);

  const handleExport = async () => {
    if (!reportRef.current) return;
    setIsExporting(true);
    toast({
      title: "Exporting Report",
      description: "Generating PDF report, please wait...",
    });

    try {
        const canvas = await html2canvas(reportRef.current, {
            scale: 2, // Higher scale for better quality
        });
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF({
            orientation: 'p',
            unit: 'px',
            format: [canvas.width, canvas.height]
        });
        pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
        
        const safeFileName = fileName?.replace(/[^a-z0-9]/gi, '_').toLowerCase() || 'document';
        pdf.save(`${safeFileName}_report.pdf`);
    } catch (error) {
        console.error("Failed to export PDF", error);
        toast({
            variant: "destructive",
            title: "Export Failed",
            description: "Could not generate the PDF report.",
        });
    } finally {
        setIsExporting(false);
    }
  };


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

  const handleClearChat = () => {
    if (fileId) {
      clearChat(fileId);
      setMessages([]);
       if (fileName) {
        const initialMessage: ChatMessage = {
          role: 'assistant',
          content: `Hello! I'm ready to answer your questions about "${fileName}". How can I help you?`,
        };
        setMessages([initialMessage]);
      }
      toast({
        title: "Chat Cleared",
        description: "Your conversation history for this document has been cleared.",
      })
    }
  }

  return (
      <div className="flex h-[calc(100vh-8rem)] flex-col gap-6">
        {/* Hidden component for PDF generation */}
        <div style={{ position: 'absolute', left: '-9999px', top: 0 }}>
            <ExportReport
              ref={reportRef}
              docName={fileName ?? 'N/A'}
              summary={summary}
              analysis={analysis}
              chatHistory={messages}
            />
        </div>
        <Card className="shadow-md border-primary/20">
            <CardHeader>
                <CardTitle className="font-headline text-2xl flex items-center gap-3 text-primary">
                    <Search className="h-6 w-6 text-accent" />
                    Ask About: {fileName}
                </CardTitle>
                 <CardDescription>
                    Use natural language to ask questions about your document. Suggestions may appear here.
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

        <Card className="flex-1 flex flex-col h-full shadow-md border-primary/20">
            <CardHeader className="border-b border-primary/10 flex-row justify-between items-center">
                <div>
                    <CardTitle className="font-headline text-xl flex items-center gap-2 text-primary">
                        <BrainCircuit className="h-5 w-5" />
                        Conversation History
                    </CardTitle>
                    <CardDescription className="pt-1">
                        Review the AI's responses and cited clauses.
                    </CardDescription>
                </div>
                 <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={handleExport} disabled={isExporting}>
                        <Download className="mr-2 h-4 w-4" />
                        {isExporting ? 'Exporting...' : 'Export as PDF'}
                    </Button>
                    <Button variant="destructive" size="sm" onClick={handleClearChat}>Clear Chat</Button>
                </div>
            </CardHeader>
            <CardContent className="flex-1 p-0">
                <ScrollArea className="h-[45vh] p-6" ref={scrollAreaRef}>
                    <div className="space-y-8">
                    {messages.map((message, index) => (
                        <div key={index} className={`flex items-start gap-4 ${message.role === 'user' ? 'justify-end' : ''}`}>
                             {message.role === 'assistant' && (
                                 <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent border-2 border-amber-300">
                                    <Bot className="h-5 w-5 text-accent-foreground" />
                                </div>
                             )}

                            <div className={`w-full max-w-[85%]`}>
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
                                <div className="bg-secondary rounded-lg p-3 ml-auto flex items-center gap-4">
                                    <p className="text-secondary-foreground">{message.content}</p>
                                     <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-card border">
                                        <User className="h-5 w-5 text-foreground" />
                                    </div>
                                </div>
                               )}
                            </div>
                        </div>
                    ))}
                     {isLoading && (
                        <div className="flex items-start gap-4">
                             <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent border-2 border-amber-300">
                                <Bot className="h-5 w-5 text-accent-foreground" />
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

function ChatPageContent() {
  const searchParams = useSearchParams();
  const fileId = searchParams.get('fileId');

  if (fileId) {
    return <ChatDetailPage />;
  }
  return <ChatListPage />;
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
