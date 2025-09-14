import { BookText, FileText } from 'lucide-react';
import { summaries } from '@/lib/placeholder-data';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import DashboardLayout from '@/components/dashboard/dashboard-layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export default function SummariesPage() {
  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        <Card>
            <CardHeader>
                <CardTitle className="font-headline text-2xl flex items-center gap-2">
                    <BookText className="h-6 w-6" /> Document Summaries
                </CardTitle>
                <CardDescription>
                    Review concise AI-generated summaries of your uploaded documents.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Accordion type="single" collapsible className="w-full">
                {summaries.map((summary) => (
                    <AccordionItem value={`item-${summary.id}`} key={summary.id}>
                    <AccordionTrigger className="hover:no-underline">
                        <div className="flex items-center gap-3 text-left">
                            <FileText className="h-5 w-5 shrink-0 text-primary" />
                            <div>
                                <p className="font-medium">{summary.docName}</p>
                                <p className="text-xs text-muted-foreground">Summarized on: {summary.date}</p>
                            </div>
                        </div>
                    </AccordionTrigger>
                    <AccordionContent className="text-base text-foreground/80 leading-relaxed pl-10">
                       {summary.summary}
                    </AccordionContent>
                    </AccordionItem>
                ))}
                 {summaries.length === 0 && (
                     <div className="text-center py-12 text-muted-foreground">
                        <p>No summaries available yet.</p>
                        <p>Summarize a document from the 'My Files' page to see it here.</p>
                    </div>
                )}
                </Accordion>
            </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
