'use client';

import { useState, useRef } from 'react';
import { Download, Loader2, File as FileIcon, FileText } from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

import DashboardLayout from '@/components/dashboard/dashboard-layout';
import { FilesProvider, useFiles } from '@/hooks/use-files';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { ExportReport } from '@/components/dashboard/export-report';
import { SummaryData, AnalysisData, ChatMessage } from '@/lib/placeholder-data';


function ReportsPageContent() {
  const { files, getSummary, getAnalysis, getChatSession } = useFiles();
  const { toast } = useToast();

  const [selectedFileId, setSelectedFileId] = useState<string | null>(null);
  const [includeSummary, setIncludeSummary] = useState(true);
  const [includeAnalysis, setIncludeAnalysis] = useState(true);
  const [includeChat, setIncludeChat] = useState(true);
  const [isExporting, setIsExporting] = useState(false);
  
  const reportRef = useRef<HTMLDivElement>(null);
  
  const selectedFile = files.find(f => f.id === selectedFileId);
  const summary = selectedFileId ? getSummary(selectedFileId) : null;
  const analysis = selectedFileId ? getAnalysis(selectedFileId) : null;
  const chatSession = selectedFileId ? getChatSession(selectedFileId) : null;

  const handleExport = async () => {
    if (!reportRef.current || !selectedFile) {
        toast({
            variant: "destructive",
            title: "Export Failed",
            description: "Please select a document and ensure content is ready.",
        });
        return;
    }
    
    setIsExporting(true);
    toast({
      title: "Exporting Report",
      description: "Generating PDF report, please wait...",
    });

    // Need a delay to allow the hidden component to render with the new props
    await new Promise(resolve => setTimeout(resolve, 100));

    try {
        const canvas = await html2canvas(reportRef.current, {
            scale: 2,
        });
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF({
            orientation: 'p',
            unit: 'px',
            format: [canvas.width, canvas.height]
        });
        pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
        
        const safeFileName = selectedFile.name?.replace(/[^a-z0-9]/gi, '_').toLowerCase() || 'document';
        
        // Open in new tab
        const pdfBlob = pdf.output('blob');
        const pdfUrl = URL.createObjectURL(pdfBlob);
        window.open(pdfUrl, '_blank');
        
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


  return (
    <div className="space-y-8">
       {/* Hidden component for PDF generation */}
       <div className="absolute left-[-9999px] top-0">
           {selectedFile && (
                <ExportReport
                    ref={reportRef}
                    docName={selectedFile.name ?? 'N/A'}
                    includeSummary={includeSummary}
                    summary={summary}
                    includeAnalysis={includeAnalysis}
                    analysis={analysis}
                    includeChat={includeChat}
                    chatHistory={chatSession?.messages ?? []}
                />
           )}
       </div>

       <Card>
           <CardHeader>
                <CardTitle className="font-headline text-2xl flex items-center gap-2">
                    <Download className="h-6 w-6" /> Reports & Exports
                </CardTitle>
                <CardDescription>
                    Generate and download customized PDF reports for your documents.
                </CardDescription>
            </CardHeader>
           <CardContent className="space-y-6">
                <div className="space-y-2">
                    <Label htmlFor="document-select">1. Select a Document</Label>
                     <Select onValueChange={setSelectedFileId} value={selectedFileId ?? undefined}>
                        <SelectTrigger id="document-select">
                            <SelectValue placeholder="Choose a document..." />
                        </SelectTrigger>
                        <SelectContent>
                            {files.length > 0 ? files.map(file => (
                                <SelectItem key={file.id} value={file.id}>{file.name}</SelectItem>
                            )) : (
                                <div className="p-4 text-center text-sm text-muted-foreground">No files uploaded.</div>
                            )}
                        </SelectContent>
                    </Select>
                </div>

                {selectedFileId && (
                     <div className="space-y-4">
                        <div>
                            <Label>2. Choose Sections to Include</Label>
                            <div className="space-y-2 pt-2">
                                <div className="flex items-center space-x-2">
                                    <Checkbox id="include-summary" checked={includeSummary} onCheckedChange={(checked) => setIncludeSummary(!!checked)} disabled={!summary}/>
                                    <label htmlFor="include-summary" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                        Executive Summary {!summary && <span className="text-muted-foreground text-xs">(Not available)</span>}
                                    </label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Checkbox id="include-analysis" checked={includeAnalysis} onCheckedChange={(checked) => setIncludeAnalysis(!!checked)} disabled={!analysis}/>
                                    <label htmlFor="include-analysis" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                        Full Analysis {!analysis && <span className="text-muted-foreground text-xs">(Not available)</span>}
                                    </label>
                                </div>
                                 <div className="flex items-center space-x-2">
                                    <Checkbox id="include-chat" checked={includeChat} onCheckedChange={(checked) => setIncludeChat(!!checked)} disabled={!chatSession || chatSession.messages.length === 0}/>
                                    <label htmlFor="include-chat" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                        Chat History {(!chatSession || chatSession.messages.length === 0) && <span className="text-muted-foreground text-xs">(Not available)</span>}
                                    </label>
                                </div>
                            </div>
                        </div>

                        <Button onClick={handleExport} disabled={isExporting || !selectedFileId}>
                            {isExporting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Download className="mr-2 h-4 w-4" />}
                            {isExporting ? "Generating..." : "Generate & Download Report"}
                        </Button>
                     </div>
                )}
           </CardContent>
       </Card>
    </div>
  );
}

export default function ReportsPage() {
  return (
    <DashboardLayout>
      <FilesProvider>
        <ReportsPageContent />
      </FilesProvider>
    </DashboardLayout>
  );
}
