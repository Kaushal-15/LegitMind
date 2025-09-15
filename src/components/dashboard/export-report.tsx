'use client';

import React from 'react';
import { Bot, User, ListOrdered, UserCheck, Shield, AlertTriangle, FileText, BookText, BrainCircuit } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Logo } from '@/components/logo';
import { SummaryData, AnalysisData, ChatMessage } from '@/lib/placeholder-data';

interface ExportReportProps {
  docName: string;
  summary: SummaryData | null;
  analysis: AnalysisData | null;
  chatHistory: ChatMessage[];
}

export const ExportReport = React.forwardRef<HTMLDivElement, ExportReportProps>(
  ({ docName, summary, analysis, chatHistory }, ref) => {
    return (
      <div ref={ref} className="p-10 bg-background" style={{ width: '800px' }}>
        <header className="flex justify-between items-center pb-4 border-b-2 border-primary">
          <Logo />
          <div className="text-right">
            <h2 className="font-headline text-2xl font-bold">Reports and Exports</h2>
            <p className="text-muted-foreground">{new Date().toLocaleDateString()}</p>
          </div>
        </header>

        <main className="space-y-8 mt-8">
          <Card>
            <CardHeader>
              <CardTitle className="font-headline text-xl flex items-center gap-2">
                <FileText className="h-5 w-5" /> Document: {docName}
              </CardTitle>
            </CardHeader>
          </Card>
          
          {summary && (
            <Card>
              <CardHeader>
                <CardTitle className="font-headline text-xl flex items-center gap-2">
                  <BookText className="h-5 w-5" /> Executive Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-base leading-relaxed">{summary.summary}</p>
              </CardContent>
            </Card>
          )}

          {analysis && (
             <div className="space-y-8">
                <Card>
                    <CardHeader>
                        <CardTitle className="font-headline text-xl flex items-center gap-2">
                            <ListOrdered className="h-5 w-5" /> Key Clauses
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                    {analysis.analysis.clauses.map((clause, index) => (
                        <div key={`clause-${index}`}>
                        <p className="font-semibold">{clause.title}</p>
                        <p className="text-muted-foreground text-sm">{clause.description}</p>
                        {index < analysis.analysis.clauses.length - 1 && <Separator className="mt-4" />}
                        </div>
                    ))}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="font-headline text-xl flex items-center gap-2">
                        <UserCheck className="h-5 w-5" /> Party Obligations
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                    {analysis.analysis.obligations.map((obligation, index) => (
                        <div key={`obligation-${index}`}>
                            <div className="flex justify-between items-start">
                            <div>
                                <p className="font-semibold">{obligation.party}</p>
                                <p className="text-muted-foreground text-sm">{obligation.description}</p>
                            </div>
                            {obligation.dueDate && <Badge variant="secondary">{obligation.dueDate}</Badge>}
                            </div>
                            {index < analysis.analysis.obligations.length - 1 && <Separator className="mt-4" />}
                        </div>
                    ))}
                    </CardContent>
                </Card>
                
                <Card>
                    <CardHeader>
                        <CardTitle className="font-headline text-xl flex items-center gap-2">
                        <Shield className="h-5 w-5" /> Risks & Mitigations
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                    {analysis.analysis.risks.map((risk, index) => (
                        <div key={`risk-${index}`}>
                        <div className="flex items-center gap-2 mb-2">
                            <AlertTriangle className={`h-5 w-5 ${
                            risk.level === 'High' ? 'text-destructive' : risk.level === 'Medium' ? 'text-primary' : 'text-green-500'
                            }`} />
                            <Badge variant={risk.level === 'High' ? 'destructive' : risk.level === 'Medium' ? 'default' : 'secondary'}>{risk.level} Risk</Badge>
                        </div>
                        <p className="font-medium text-sm mb-1">{risk.description}</p>
                        <p className="text-muted-foreground text-xs bg-secondary p-2 rounded-md">
                            <span className="font-semibold">Mitigation: </span>{risk.mitigation}
                        </p>
                        {index < analysis.analysis.risks.length - 1 && <Separator className="mt-6" />}
                        </div>
                    ))}
                    </CardContent>
                </Card>
             </div>
          )}

          {chatHistory.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="font-headline text-xl flex items-center gap-2">
                  <BrainCircuit className="h-5 w-5" /> Conversation History
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {chatHistory.map((message, index) => (
                   <div key={`chat-${index}`} className={`flex items-start gap-4`}>
                    {message.role === 'assistant' && (
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent">
                            <Bot className="h-5 w-5 text-accent-foreground" />
                        </div>
                    )}
                     {message.role === 'user' && (
                         <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-secondary ml-auto">
                            <User className="h-5 w-5 text-secondary-foreground" />
                        </div>
                     )}
                    <div className={`rounded-lg p-3 max-w-[85%] ${message.role === 'user' ? 'bg-secondary' : 'bg-primary/5'}`}>
                        <p className="text-foreground leading-relaxed">{message.content}</p>
                    </div>
                   </div>
                ))}
              </CardContent>
            </Card>
          )}

        </main>
      </div>
    );
  }
);

ExportReport.displayName = 'ExportReport';
