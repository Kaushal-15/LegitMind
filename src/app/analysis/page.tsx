'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { FileText, Shield, AlertTriangle, FileWarning, Loader2, ListOrdered, UserCheck, Microscope } from 'lucide-react';
import DashboardLayout from '@/components/dashboard/dashboard-layout';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { AnalyzeDocumentOutput, AnalysisData } from '@/lib/placeholder-data';
import { useToast } from '@/hooks/use-toast';
import { Separator } from '@/components/ui/separator';
import { useFiles, FilesProvider } from '@/hooks/use-files';
import { Accordion, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

function AnalysisListPage() {
    const { analyses } = useFiles();
    const router = useRouter();

    const handleSelectAnalysis = (analysis: AnalysisData) => {
        router.push(`/analysis?fileId=${analysis.docId}&fileName=${encodeURIComponent(analysis.docName)}`);
    }

    return (
         <div className="max-w-4xl mx-auto">
            <Card>
                <CardHeader>
                    <CardTitle className="font-headline text-2xl flex items-center gap-2">
                        <ListOrdered className="h-6 w-6" /> Clauses & Document Analyses
                    </CardTitle>
                    <CardDescription>
                        Review AI-generated analyses of your uploaded documents.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Accordion type="single" collapsible className="w-full">
                    {analyses.map((analysis) => (
                        <AccordionItem value={`item-${analysis.id}`} key={analysis.id} className="cursor-pointer" onClick={() => handleSelectAnalysis(analysis)}>
                            <AccordionTrigger className="hover:no-underline">
                                <div className="flex items-center gap-3 text-left">
                                    <FileText className="h-5 w-5 shrink-0 text-primary" />
                                    <div>
                                        <p className="font-medium">{analysis.docName}</p>
                                        <p className="text-xs text-muted-foreground">Analyzed on: {analysis.date}</p>
                                    </div>
                                </div>
                            </AccordionTrigger>
                        </AccordionItem>
                    ))}
                    {analyses.length === 0 && (
                        <div className="text-center py-12 text-muted-foreground">
                            <p>No analyses available yet.</p>
                            <p>Upload a document to see its analysis here.</p>
                        </div>
                    )}
                    </Accordion>
                </CardContent>
            </Card>
        </div>
    )
}


function AnalysisDetailPage() {
  const searchParams = useSearchParams();
  const fileId = searchParams.get('fileId');
  const fileName = searchParams.get('fileName');
  const { getAnalysis } = useFiles();
  
  const [analysisResult, setAnalysisResult] = useState<AnalyzeDocumentOutput | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (fileId) {
      const storedAnalysis = getAnalysis(fileId);
      if (storedAnalysis) {
        setAnalysisResult(storedAnalysis.analysis);
        setIsLoading(false);
      } else {
        toast({
          variant: 'destructive',
          title: 'Analysis Not Found',
          description: 'Could not retrieve the analysis for this file.',
        });
        setIsLoading(false);
      }
    } else {
        setIsLoading(false);
    }
  }, [fileId, getAnalysis, toast]);
  

  if (isLoading) {
     return (
        <div className="flex h-full flex-col items-center justify-center rounded-lg border-2 border-dashed bg-card py-20">
          <Loader2 className="h-16 w-16 animate-spin text-primary" />
          <h2 className="mt-6 text-2xl font-headline font-semibold">
            Loading Analysis...
          </h2>
        </div>
    );
  }

  return (
      <div className="space-y-6">
        <Card>
            <CardHeader>
                <CardTitle className="font-headline text-2xl flex items-center gap-3">
                    <FileText className="h-6 w-6 text-primary" />
                    Analysis for: {fileName}
                </CardTitle>
                <CardDescription>
                    AI-powered breakdown of clauses, obligations, and risks.
                </CardDescription>
            </CardHeader>
        </Card>

        {analysisResult ? (
          <div className="grid gap-6 lg:grid-cols-1 xl:grid-cols-3">
            <div className="xl:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 font-headline">
                    <ListOrdered className="h-5 w-5" /> Key Clauses
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {analysisResult.clauses.map((clause, index) => (
                    <div key={index}>
                      <p className="font-semibold">{clause.title}</p>
                      <p className="text-muted-foreground text-sm">{clause.description}</p>
                      {index < analysisResult.clauses.length - 1 && <Separator className="mt-4" />}
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 font-headline">
                    <UserCheck className="h-5 w-5" /> Party Obligations
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {analysisResult.obligations.map((obligation, index) => (
                     <div key={index}>
                        <div className="flex justify-between items-start">
                          <div>
                              <p className="font-semibold">{obligation.party}</p>
                              <p className="text-muted-foreground text-sm">{obligation.description}</p>
                          </div>
                          {obligation.dueDate && <Badge variant="secondary">{obligation.dueDate}</Badge>}
                        </div>
                        {index < analysisResult.obligations.length - 1 && <Separator className="mt-4" />}
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
            
            <div className="xl:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 font-headline">
                    <Shield className="h-5 w-5" /> Risks & Mitigations
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {analysisResult.risks.map((risk, index) => (
                    <div key={index}>
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
                       {index < analysisResult.risks.length - 1 && <Separator className="mt-6" />}
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        ) : (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">No analysis data available for this document, or it is still being processed.</p>
            </CardContent>
          </Card>
        )}
      </div>
  );
}

function AnalysisPageContent() {
    const searchParams = useSearchParams();
    const fileId = searchParams.get('fileId');

    if (fileId) {
        return <AnalysisDetailPage />;
    }
    return <AnalysisListPage />;
}


function AnalysisPage() {
    return (
        <DashboardLayout>
            <FilesProvider>
                <Suspense fallback={<div className="flex justify-center items-center py-20"><Loader2 className="h-12 w-12 animate-spin text-primary" /></div>}>
                    <AnalysisPageContent />
                </Suspense>
            </FilesProvider>
        </DashboardLayout>
    )
}

export default AnalysisPage;
