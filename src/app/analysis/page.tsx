'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { FileText, Shield, AlertTriangle, FileWarning, Loader2, ListOrdered, UserCheck } from 'lucide-react';
import DashboardLayout from '@/components/dashboard/dashboard-layout';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { analyzeDocument, AnalyzeDocumentOutput } from '@/ai/flows/analyze-document';
import { useToast } from '@/hooks/use-toast';
import { Separator } from '@/components/ui/separator';
import { useFiles, FilesProvider } from '@/hooks/use-files';

function AnalysisPageContent() {
  const searchParams = useSearchParams();
  const fileId = searchParams.get('fileId');
  const fileName = searchParams.get('fileName');
  const { getFileContent } = useFiles();
  
  const [analysisResult, setAnalysisResult] = useState<AnalyzeDocumentOutput | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (fileId && fileName) {
      setIsLoading(true);
      const documentText = getFileContent(fileId);
      
      if (!documentText) {
        toast({
            variant: 'destructive',
            title: 'File Content Not Found',
            description: 'Could not retrieve the content for this file.',
        });
        setIsLoading(false);
        return;
      }

      analyzeDocument({ documentText })
        .then(result => {
          setAnalysisResult(result);
        })
        .catch(error => {
          console.error('Error analyzing document:', error);
          toast({
            variant: 'destructive',
            title: 'Analysis Failed',
            description: 'Could not analyze the document at this time. Please try again later.',
          });
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [fileId, fileName, getFileContent, toast]);

  if (!fileId || !fileName) {
    return (
        <div className="flex h-full flex-col items-center justify-center rounded-lg border-2 border-dashed bg-card">
          <FileWarning className="h-16 w-16 text-muted-foreground" />
          <h2 className="mt-6 text-2xl font-headline font-semibold">
            Select a Document to Analyze
          </h2>
          <p className="mt-2 text-center text-muted-foreground">
            Please go back to the 'My Files' page and choose a document to analyze.
          </p>
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

        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <p className="ml-4 text-lg text-muted-foreground">Analyzing document...</p>
          </div>
        ) : analysisResult ? (
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
              <p className="text-muted-foreground">No analysis data available for this document.</p>
            </CardContent>
          </Card>
        )}
      </div>
  );
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
